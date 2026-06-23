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
  test("возвращает помещение по существующему id", async () => {
    const area = await AreaService.findById(6);

    expect(area.id).toBe(6);
    expect(area.title).toBe("Помещение 12");
    expect(area.capacity).toBe(5);
  });

  test("работает со строковым id", async () => {
    const area = await AreaService.findById("1");

    expect(area.id).toBe(1);
    expect(area.title).toBe("Помещение 75");
  });

  test("бросает ошибку при несуществующем id", async () => {
    await expect(AreaService.findById(99999)).rejects.toThrow(
      "Комната не найдена",
    );
  });
});
