import { expect, test, describe, afterAll, beforeAll } from "vitest";

import TimeslotService from "../../src/api/timeslot/timeslot.service";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

beforeAll(async () => {
  await createTables(false);
  await seedTables(["timeslots"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("TimeslotService.findAll", () => {
  test("возвращает все временные слоты", async () => {
    const slots = await TimeslotService.findAll();
    expect(slots).toHaveLength(6);
  });

  test("у каждого слота есть start и end в виде строки", async () => {
    const slots = await TimeslotService.findAll();

    expect(slots[0]).toHaveProperty("start");
    expect(slots[0]).toHaveProperty("end");
    expect(typeof slots[0]!.start).toBe("string");
    expect(typeof slots[0]!.end).toBe("string");
  });

  test("первый слот — 10:00 - 11:00", async () => {
    const slots = await TimeslotService.findAll();
    const first = slots.find((s) => s.start === "10:00");

    expect(first).toBeDefined();
    expect(first?.end).toBe("11:00");
  });
});
