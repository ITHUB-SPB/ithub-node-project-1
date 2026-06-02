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

describe("/api/bookings", () => {
  describe("GET", () => {
    test("возвращает список бронирований", async () => {
      const response = await request(app).get("/api/bookings");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("bookings");
      expect(response.body.bookings).toHaveLength(10);
    });
  });

  describe("POST", () => {
    test("создает новое бронирование", async () => {
      const response = await request(app).post("/api/bookings").send({
        title: "Test Booking",
        username: "testuser",
        timeslotId: 1,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("booking");
      expect(response.body.booking).toHaveProperty("id");
    });

    test("возвращает ошибку если данные невалидны", async () => {
      const response = await request(app).post("/api/bookings").send({
        title: "",
        username: "",
        timeslotId: "invalid",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE", () => {
    test("удаляет бронирование по id", async () => {
      const createResponse = await request(app).post("/api/bookings").send({
        title: "Test Booking",
        username: "testuser",
        timeslotId: 2,
      });

      const bookingId = createResponse.body.booking.id;

      const deleteResponse = await request(app).delete(
        `/api/bookings/${bookingId}`
      );

      expect(deleteResponse.status).toBe(204);

      const getResponse = await request(app).get("/api/bookings");
      const deleted = getResponse.body.bookings.find(
        (b: any) => b.id === bookingId
      );

      expect(deleted).toBeUndefined();
    });

    test("возвращает ошибку если id невалидный", async () => {
      const response = await request(app).delete("/api/bookings/invalid");

      expect(response.status).toBe(400);
    });
  });
});
