import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import AreaService from "../../src/api/area/area.service.ts";

let service;
let sqlite;

beforeAll(() => {
  sqlite = new Database(":memory:");
  const db = new Kysely({
    dialect: new SqliteDialect({ database: sqlite }),
  });

  sqlite.exec(`
    CREATE TABLE areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL
    );
  `);

  service = new AreaService(db);
});

beforeEach(() => {
  sqlite.exec("DELETE FROM areas");
  sqlite.exec(`
    INSERT INTO areas (title) VALUES ('комната 1');
    INSERT INTO areas (title) VALUES ('комната 2');
    INSERT INTO areas (title) VALUES ('комната 3');
  `);
});

describe("AreaService.findAll", () => {
  test("вывод без фильтров", async () => {
    const areas = await service.findAll({
      pathParams: null,
      queryParams: {},
    });

    expect(areas).toHaveLength(3);
    expect(areas[0]).toHaveProperty("id");
    expect(areas[0]).toHaveProperty("title");
    expect(areas[0].title).toBe("комната 1");
  });

  test("фильтрация по id", async () => {
    const all = await service.findAll({
      pathParams: null,
      queryParams: {},
    });
    const ids = [all[0].id, all[2].id].join(",");

    const areas = await service.findAll({
      pathParams: null,
      queryParams: { filter: ids },
    });

    expect(areas).toHaveLength(2);
  });

  test("лимит 2", async () => {
    const areas = await service.findAll({
      pathParams: null,
      queryParams: { limit: 2, offset: 0 },
    });

    expect(areas).toHaveLength(2);
  });
});

describe("AreaService.findById", () => {
test("найти помещение которое есть", async () => {
  const all = await service.findAll({
    pathParams: null,
    queryParams: {},
  });
  const firstId = all[0].id;

  const area = await service.findOne(firstId);
  expect(area).not.toBeNull();
  expect(area.title).toBe("комната 1");
});

  test("вернуть null если ничего нет", async () => {
    const area = await service.findOne(999);
    expect(area).toBeNull();
  });
});