import { expect, test, describe, afterAll, beforeAll } from "vitest";

import BookingService from "../../src/api/booking/booking.service";

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

describe("BookingService", () => {
  describe("findAll", () => {
    test("возвращает все бронирования", async () => {
      const bookings = await BookingService.findAll();

      expect(bookings).toHaveLength(10);
      expect(bookings[0]).toHaveProperty("id");
      expect(bookings[0]).toHaveProperty("timeslotId");
    });

    test("возвращает бронирования с лимитом", async () => {
      const bookings = await BookingService.findAll({ limit: 3 });

      expect(bookings).toHaveLength(3);
    });

    test("возвращает бронирования с офсетом", async () => {
      const allBookings = await BookingService.findAll();
      const offsetBookings = await BookingService.findAll({ offset: 5 });

      expect(offsetBookings.length).toBeLessThan(allBookings.length);
    });
  });

  describe("create", () => {
    test("создает новое бронирование", async () => {
      const payload = {
        timeslotId: 1,
        createdAt: Math.floor(Date.now() / 1000),
      };

      const booking = await BookingService.create(payload);

      expect(booking).toHaveProperty("id");
      expect(booking?.timeslotId).toBe(1);
      expect(booking?.createdAt).toBe(payload.createdAt);
    });
  });

  describe("delete", () => {
    test("удаляет бронирование по id", async () => {
      const payload = {
        timeslotId: 2,
        createdAt: Math.floor(Date.now() / 1000),
      };

      const booking = await BookingService.create(payload);
      const bookingId = booking?.id;

      await BookingService.delete(bookingId as number);

      const remaining = await BookingService.findAll();
      const deleted = remaining.find((b) => b.id === bookingId);

      expect(deleted).toBeUndefined();
    });
  });
});
