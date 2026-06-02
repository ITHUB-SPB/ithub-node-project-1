import { expect, test, describe, afterAll, beforeAll } from "vitest";
import request from "supertest";

import { app } from "../../src/main";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

beforeAll(async () => {
  await createTables(false);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("/api/timeslots", () => {
  test("возвращает список слотов", async () => {
    const response = await request(app).get("/api/timeslots");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("slots");
    expect(response.body.slots.length).toBeGreaterThan(0);
  });

  test("фильтрует слоты по периоду AM", async () => {
    const response = await request(app).get("/api/timeslots?period=AM");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("slots");
    response.body.slots.forEach((slot: any) => {
      const hours = new Date(slot.start).getHours();
      expect(hours).toBeLessThan(12);
    });
  });

  test("фильтрует слоты по периоду PM", async () => {
    const response = await request(app).get("/api/timeslots?period=PM");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("slots");
    response.body.slots.forEach((slot: any) => {
      const hours = new Date(slot.start).getHours();
      expect(hours).toBeGreaterThanOrEqual(12);
    });
  });
});
