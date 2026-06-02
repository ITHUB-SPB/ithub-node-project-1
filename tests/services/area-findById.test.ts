import { expect, test, describe, afterAll, beforeAll } from "vitest";

import AreaService from "../../src/api/area/area.service";

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

describe("AreaService.findById", () => {
  test("находит помещение по id", async () => {
    const area = await AreaService.findById(1);

    expect(area).toHaveProperty("id");
    expect(area).toHaveProperty("title");
    expect(area).toHaveProperty("capacity");
    expect(area.id).toBe(1);
  });

  test("выбрасывает ошибку если помещение не найдено", async () => {
    try {
      await AreaService.findById(999);
      expect.fail("должна была выброшена ошибка");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
