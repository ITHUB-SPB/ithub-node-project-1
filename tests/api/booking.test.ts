import {
  expect,
  test,
  describe,
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";
import request from "supertest";
import express from "express";

import { areaRoutes } from "../../src/api/area/area.router";
import { bookingRoutes } from "../../src/api/booking/booking.router";
import { timeslotRoutes } from "../../src/api/timeslot/timeslot.router";

import BookingService from "../../src/api/booking/booking.service";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

// Собираем тестовое приложение без app.listen, чтобы не занимать порт 3000
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

beforeEach(async () => {
  await db.deleteFrom("bookings").execute();
});

function makeBooking() {
  return {
    areaId: 1,
    timeslotId: 1,
    title: "Встреча",
    username: "Ника",
    createdAt: Math.floor(Date.now() / 1000),
  };
}

describe("GET /api/bookings", () => {
  test("без записей возвращает 200 и пустой список", async () => {
    const response = await request(app).get("/api/bookings");

    expect(response.status).toBe(200);
    expect(response.body.bookings).toEqual([]);
  });

  test("возвращает созданные бронирования", async () => {
    await BookingService.create(makeBooking());

    const response = await request(app).get("/api/bookings");

    expect(response.status).toBe(200);
    expect(response.body.bookings).toHaveLength(1);
  });
});

describe("POST /api/bookings", () => {
  test("400 при отсутствии обязательных полей", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ title: "Только название" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("400 при некорректном timeslotId", async () => {
    const response = await request(app).post("/api/bookings").send({
      title: "Лекция",
      username: "Ника",
      timeslotId: "не число",
    });

    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/bookings/:id", () => {
  test("204 при удалении существующей записи", async () => {
    const created = await BookingService.create(makeBooking());

    const response = await request(app).delete(
      `/api/bookings/${created?.id}`,
    );

    expect(response.status).toBe(204);
  });

  test("400 при нечисловом id", async () => {
    const response = await request(app).delete("/api/bookings/abc");

    expect(response.status).toBe(400);
  });
});
