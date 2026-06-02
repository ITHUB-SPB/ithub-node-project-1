import { assert, expect, test, describe, afterAll, beforeAll } from "vitest";
import * as v from "valibot";

import AreaService from "../../src/api/area/area.service";
import { areasSchema } from "../../src/api/area/area.schema";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

beforeAll(async () => {
  await createTables(true);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("AreaService.findAll", () => {
  test("Вывод без фильтров", async () => {
    const areas = await AreaService.findAll({});

    const parseResult = v.safeParse(areasSchema, areas);

    expect(parseResult.success).toBe(true);
    if (!parseResult.success) return;
    expect(parseResult.output).toHaveLength(10);
    
    for (const area of parseResult.output) {
      expect(area).toHaveProperty('id');
      expect(area).toHaveProperty('title');
      expect(area).toHaveProperty('capacity');
      expect(area).toHaveProperty('wifi');
      expect(area).toHaveProperty('board');
      expect(area).toHaveProperty('plasma');
      expect(typeof area.capacity).toBe('number');
    }
  });

  test("Фильтрация по вместимости", async () => {
    const queryParams = { capacity: 17 };
    const areas = await AreaService.findAll(queryParams);

    const parseResult = v.safeParse(areasSchema, areas);

    expect(parseResult.success).toBe(true);
    if (!parseResult.success) return;
    expect(parseResult.output.length).toBeGreaterThan(0);
    
    for (const area of parseResult.output) {
      expect(area.capacity).toBeGreaterThanOrEqual(17);
    }
  });

  test("Пагинация - limit работает корректно", async () => {
    const queryParams = { limit: 3 };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas).toHaveLength(3);
  });

  test("Пагинация - offset работает корректно", async () => {
    const allAreas = await AreaService.findAll({});
    const queryParams = { offset: 2, limit: 10 };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas[0].id).toBe(allAreas[2].id);
  });

  test("Фильтрация по конкретным id", async () => {
    const allAreas = await AreaService.findAll({});
    const idsToFilter = [allAreas[0].id, allAreas[2].id];
    const queryParams = { filter: idsToFilter };
    
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas).toHaveLength(2);
    expect(areas.map(a => a.id)).toEqual(expect.arrayContaining(idsToFilter));
  });

  test("Фильтрация только по Wi-Fi", async () => {
    const queryParams = { wifi: "1" as const };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas.length).toBeGreaterThan(0);
    expect(areas.every(a => a.wifi === 1)).toBe(true);
  });

  test("Фильтрация только по доске", async () => {
    const queryParams = { board: "1" as const };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas.length).toBeGreaterThan(0);
    expect(areas.every(a => a.board === 1)).toBe(true);
  });

  test("Фильтрация только по плазме", async () => {
    const queryParams = { plasma: "1" as const };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas.length).toBeGreaterThan(0);
    expect(areas.every(a => a.plasma === 1)).toBe(true);
  });

  test("Комбинация фильтров: вместимость + Wi-Fi + доска", async () => {
    const queryParams = { 
      capacity: 10,
      wifi: "1" as const,
      board: "1" as const
    };
    const areas = await AreaService.findAll(queryParams);
    
    expect(areas.every(a => 
      a.capacity >= 10 && a.wifi === 1 && a.board === 1
    )).toBe(true);
  });
});

describe("AreaService.findById", () => {
  test("Поиск по существующему id возвращает правильную комнату", async () => {
    const allAreas = await AreaService.findAll({});
    const targetId = allAreas[0].id;
    
    const area = await AreaService.findById(targetId);
    
    expect(area.id).toBe(targetId);
    expect(area.title).toBe(allAreas[0].title);
  });

  test("Поиск по несуществующему id выбрасывает ошибку", async () => {
    await expect(AreaService.findById(99999)).rejects.toThrow("Комната не найдена");
  });

  test("Поиск со строковым id работает корректно", async () => {
    const allAreas = await AreaService.findAll({});
    const stringId = String(allAreas[0].id);
    
    const area = await AreaService.findById(stringId);
    
    expect(area.id).toBe(allAreas[0].id);
  });
});