import { assert, expect, test, describe, afterAll, beforeAll } from "vitest";
import * as v from "valibot";

import AreaService from "../../src/api/area/area.service";
import { areasSchema } from "../../src/api/area/area.schema";

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

describe("Вывод списка помещений", () => {
  test("Вывод без фильтров", async () => {
    const expected = [
      {
        id: 6,
        title: "Помещение 12",
        capacity: 5,
        wifi: 1,
        board: 0,
        plasma: 0,
      },
      {
        id: 4,
        title: "Помещение 120",
        capacity: 8,
        wifi: 1,
        board: 0,
        plasma: 1,
      },
      {
        id: 8,
        title: "Помещение 121",
        capacity: 10,
        wifi: 1,
        board: 1,
        plasma: 1,
      },
      {
        id: 9,
        title: "Помещение 142",
        capacity: 19,
        wifi: 1,
        board: 0,
        plasma: 1,
      },
      {
        id: 3,
        title: "Помещение 147",
        capacity: 7,
        wifi: 0,
        board: 1,
        plasma: 1,
      },
      {
        id: 7,
        title: "Помещение 174",
        capacity: 17,
        wifi: 1,
        board: 1,
        plasma: 0,
      },
      {
        id: 2,
        title: "Помещение 191",
        capacity: 5,
        wifi: 1,
        board: 0,
        plasma: 1,
      },
      {
        id: 5,
        title: "Помещение 32",
        capacity: 11,
        wifi: 0,
        board: 1,
        plasma: 0,
      },
      {
        id: 10,
        title: "Помещение 5",
        capacity: 11,
        wifi: 0,
        board: 1,
        plasma: 0,
      },
      {
        id: 1,
        title: "Помещение 75",
        capacity: 20,
        wifi: 0,
        board: 1,
        plasma: 1,
      },
    ];

    const areas = await AreaService.findAll({});

    const parseResult = v.safeParse(areasSchema, areas);

    expect(parseResult.success).toBe(true);

    expect(parseResult.output).toHaveLength(10);

    for (const o of expected) {
      expect(parseResult.output).toContainEqual(o);
    }
  });

  test("Фильтрация по вместимости", async () => {
    const expected = [
      {
        id: 9,
        title: "Помещение 142",
        capacity: 19,
        wifi: 1,
        board: 0,
        plasma: 1,
      },
      {
        id: 7,
        title: "Помещение 174",
        capacity: 17,
        wifi: 1,
        board: 1,
        plasma: 0,
      },
      {
        id: 1,
        title: "Помещение 75",
        capacity: 20,
        wifi: 0,
        board: 1,
        plasma: 1,
      },
    ];

    const queryParams = {
      capacity: 17,
    };

    const areas = await AreaService.findAll(queryParams);

    const parseResult = v.safeParse(areasSchema, areas);

    expect(parseResult.success).toBe(true);

    expect(parseResult.output).toHaveLength(3);

    for (const o of expected) {
      expect(parseResult.output).toContainEqual(o);
    }
  });
});