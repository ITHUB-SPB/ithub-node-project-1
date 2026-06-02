import { expect, test, describe, afterAll, beforeAll } from "vitest";

import TimeslotService from "../../src/api/timeslot/timeslot.service";

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

describe("TimeslotService", () => {
  describe("findAll", () => {
    test("возвращает все слоты", async () => {
      const slots = await TimeslotService.findAll();

      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty("id");
      expect(slots[0]).toHaveProperty("start");
      expect(slots[0]).toHaveProperty("end");
    });

    test("фильтрует слоты по AM", async () => {
      const slots = await TimeslotService.findAll("AM");

      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((slot) => {
        const hours = new Date(slot.start).getHours();
        expect(hours).toBeLessThan(12);
      });
    });

    test("фильтрует слоты по PM", async () => {
      const slots = await TimeslotService.findAll("PM");

      expect(slots.length).toBeGreaterThan(0);
      slots.forEach((slot) => {
        const hours = new Date(slot.start).getHours();
        expect(hours).toBeGreaterThanOrEqual(12);
      });
    });
  });
});
