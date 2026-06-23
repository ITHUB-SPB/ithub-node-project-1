import {
  expect,
  test,
  describe,
  afterAll,
  beforeAll,
  beforeEach,
} from "vitest";

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

// Перед каждым тестом чистим бронирования, чтобы тесты были независимы
beforeEach(async () => {
  await db.deleteFrom("bookings").execute();
});

// Корректное бронирование: areaId и timeslotId ссылаются на засиженные записи
function makeBooking() {
  return {
    areaId: 1,
    timeslotId: 1,
    title: "Планёрка",
    username: "Ника",
    createdAt: Math.floor(Date.now() / 1000),
  };
}

describe("BookingService.create", () => {
  test("создаёт бронирование и возвращает запись", async () => {
    const created = await BookingService.create(makeBooking());

    expect(created).toBeDefined();
    expect(Number(created?.id)).toBeGreaterThan(0);
    expect(created?.title).toBe("Планёрка");
    expect(created?.username).toBe("Ника");
    expect(Number(created?.areaId)).toBe(1);
    expect(Number(created?.timeslotId)).toBe(1);
  });

  test("после создания запись реально лежит в БД", async () => {
    await BookingService.create(makeBooking());

    const all = await BookingService.findAll();
    expect(all).toHaveLength(1);
  });
});

describe("BookingService.findAll", () => {
  test("без записей возвращает пустой массив", async () => {
    const bookings = await BookingService.findAll();
    expect(bookings).toEqual([]);
  });

  test("возвращает все созданные бронирования", async () => {
    await BookingService.create(makeBooking());
    await BookingService.create(makeBooking());

    const bookings = await BookingService.findAll();
    expect(bookings).toHaveLength(2);
  });

  test("учитывает параметры limit и offset", async () => {
    await BookingService.create(makeBooking());
    await BookingService.create(makeBooking());
    await BookingService.create(makeBooking());

    const limited = await BookingService.findAll({ limit: 2 });
    expect(limited).toHaveLength(2);

    const offset = await BookingService.findAll({ limit: 2, offset: 2 });
    expect(offset).toHaveLength(1);
  });
});

describe("BookingService.delete", () => {
  test("удаляет бронирование по id", async () => {
    const created = await BookingService.create(makeBooking());

    await BookingService.delete(Number(created?.id));

    const bookings = await BookingService.findAll();
    expect(bookings).toHaveLength(0);
  });

  test("удаление несуществующего id не падает", async () => {
    await expect(BookingService.delete(99999)).resolves.not.toThrow();
  });
});
