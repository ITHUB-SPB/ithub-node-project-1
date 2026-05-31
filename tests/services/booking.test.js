import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import BookingService from "../../src/api/booking/booking.service.ts";

let service;
let sqlite;

beforeAll(() => {
  sqlite = new Database(":memory:");
  const db = new Kysely({
    dialect: new SqliteDialect({ database: sqlite }),
  });

  sqlite.exec(`
    CREATE TABLE timeslots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start INTEGER NOT NULL,
      end INTEGER NOT NULL
    );
    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeslotId INTEGER NOT NULL,
      areaId INTEGER,
      userId INTEGER,
      createdAt INTEGER,
      FOREIGN KEY (timeslotId) REFERENCES timeslots(id)
    );
  `);

  service = new BookingService(db);
});

beforeEach(() => {
  sqlite.exec("DELETE FROM bookings");
  sqlite.exec("DELETE FROM timeslots");
  sqlite.exec(`
    INSERT INTO timeslots (id, start, end) VALUES (1, 36000, 39600);
  `);
});

describe("BookingService.delete", () => {
  test("удалить бронирование", async () => {
    const booking = await service.create({
      timeslotId: 1,
      areaId: 1,
    });

    await service.delete(booking.id);

    const found = await service.findOne(booking.id);
    expect(found).toBeNull();
  });
});