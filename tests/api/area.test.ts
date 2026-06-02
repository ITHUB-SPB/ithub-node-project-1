import { assert, expect, test, describe, afterAll, beforeAll } from "vitest";
import request from "supertest";

import { app } from "../../src/main";
import AreaService from "../../src/api/area/area.service";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

beforeAll(async () => {
  await createTables(true);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("/api/areas", () => {
  test("базовый случай", async () => {
    const response = await request(app).get("/api/areas");

    expect(response.status).toBe(200);
    expect(response.body.areas).toHaveLength(10);
    expect(response.body).toHaveProperty("totalItems");
  });
});

describe("/api/areas - дополнительные тесты", () => {
  test("Пагинация с limit=3", async () => {
    const response = await request(app).get("/api/areas?limit=3");
    
    expect(response.status).toBe(200);
    expect(response.body.areas).toHaveLength(3);
    expect(response.body.totalItems).toBeGreaterThanOrEqual(10);
  });

  test("Пагинация с offset", async () => {
    const firstPage = await request(app).get("/api/areas?limit=2");
    const secondPage = await request(app).get("/api/areas?limit=2&offset=2");
    
    expect(firstPage.body.areas[0].id).not.toBe(secondPage.body.areas[0].id);
  });

  test("Фильтр по вместимости capacity=15", async () => {
    const response = await request(app).get("/api/areas?capacity=15");
    
    expect(response.status).toBe(200);
    expect(response.body.areas.every((a: any) => a.capacity >= 15)).toBe(true);
  });

  test("Фильтр по Wi-Fi", async () => {
    const response = await request(app).get("/api/areas?wifi=1");
    
    expect(response.status).toBe(200);
    expect(response.body.areas.every((a: any) => a.wifi === 1)).toBe(true);
  });

  test("Фильтр по доске", async () => {
    const response = await request(app).get("/api/areas?board=1");
    
    expect(response.status).toBe(200);
    expect(response.body.areas.every((a: any) => a.board === 1)).toBe(true);
  });

  test("Фильтр по плазме", async () => {
    const response = await request(app).get("/api/areas?plasma=1");
    
    expect(response.status).toBe(200);
    expect(response.body.areas.every((a: any) => a.plasma === 1)).toBe(true);
  });

  test("Фильтр по конкретным id через запятую", async () => {
    const all = await request(app).get("/api/areas");
    const idsToFilter = [all.body.areas[0].id, all.body.areas[2].id];
    
    const response = await request(app)
      .get(`/api/areas?filter=${idsToFilter.join(",")}`);
    
    expect(response.status).toBe(200);
    expect(response.body.areas).toHaveLength(2);
  });

  test("Комбинация фильтров", async () => {
    const response = await request(app)
      .get("/api/areas?capacity=10&wifi=1&board=1");
    
    expect(response.status).toBe(200);
    expect(response.body.areas.every((a: any) => 
      a.capacity >= 10 && a.wifi === 1 && a.board === 1
    )).toBe(true);
  });
});