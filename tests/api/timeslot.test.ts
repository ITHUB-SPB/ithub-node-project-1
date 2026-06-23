import { expect, test, describe, afterAll, beforeAll } from "vitest";
import request from "supertest";
import express from "express";

import { areaRoutes } from "../../src/api/area/area.router";
import { bookingRoutes } from "../../src/api/booking/booking.router";
import { timeslotRoutes } from "../../src/api/timeslot/timeslot.router";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

const app = express();
app.use(express.json());
app.use(areaRoutes);
app.use(bookingRoutes);
app.use(timeslotRoutes);

beforeAll(async () => {
  await createTables(false);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("GET /api/timeslots", () => {
  test("возвращает 200 и список из 6 слотов", async () => {
    const response = await request(app).get("/api/timeslots");

    expect(response.status).toBe(200);
    expect(response.body.slots).toHaveLength(6);
  });

  test("у слота есть поля start и end", async () => {
    const response = await request(app).get("/api/timeslots");

    expect(response.body.slots[0]).toHaveProperty("start");
    expect(response.body.slots[0]).toHaveProperty("end");
  });

  test("принимает параметр period без ошибки", async () => {
    const response = await request(app).get("/api/timeslots?period=AM");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.slots)).toBe(true);
  });

  test("400 при недопустимом значении period", async () => {
    const response = await request(app).get("/api/timeslots?period=XX");

    expect(response.status).toBe(400);
  });
});
