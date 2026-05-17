import { fakerRU as faker } from "@faker-js/faker";
import chalk from "chalk";
import db from "../connection.js";

export default async function seedTables(tables: string[]) {
  if (tables.length === 0) {
    await seedTimeslots();
    await seedAreas();
    await seedBookings();
    return;
  }

  const errors = [];

  for (const table of tables) {
    try {
      switch (table) {
        case "bookings":
          await seedBookings();
          break;
        case "timeslots":
          await seedTimeslots();
          break;
        case "areas":
          await seedAreas();
          break;
        default:
          throw new Error(`Таблицы ${table} не существует`);
      }
    } catch (error) {
      errors.push({
        table,
        message: (error as Error).message,
      });
    }
  }

  if (errors.length > 0) {
    const message = errors.map((e) => `- ${e.table}: ${e.message}`).join("\n");
    throw new Error(`\n${message}`);
  }
}

async function seedAreas() {
  const existing = await db.selectFrom("areas").selectAll().execute();

  if (existing.length > 0) {
    throw new Error("Таблица areas уже содержит записи");
  }

  const roomTitles = [
    "A-101",
    "A-102",
    "A-103",
    "B-101",
    "B-102",
    "B-103",
    "C-101",
    "C-102",
    "D-101",
    "D-102",
  ];

  for (const roomTitle of roomTitles) {
    await db
      .insertInto("areas")
      .values({
        title: roomTitle,
        capacity: faker.number.int({ min: 4, max: 24 }),
        hasPlasma: faker.number.int({ min: 0, max: 1 }) === 1 ? 1 : 0,
        hasBoard: faker.number.int({ min: 0, max: 1 }) === 1 ? 1 : 0,
        hasWifi: faker.number.int({ min: 0, max: 1 }) === 1 ? 1 : 0,
      })
      .execute();
  }

  const added = await db.selectFrom("areas").selectAll().execute();
  console.log(chalk.green(`✔ Было добавлено ${added.length} записей в areas`));
}

async function seedTimeslots() {
  const existing = await db.selectFrom("timeslots").selectAll().execute();

  if (existing.length > 0) {
    throw new Error("Таблица timeslots уже содержит записи");
  }

  const timeslots = [
    ["10:00", "11:00"],
    ["11:00", "12:00"],
    ["12:00", "13:00"],
    ["14:00", "15:00"],
    ["15:00", "16:00"],
    ["16:00", "18:00"],
  ];

  for (const [start, end] of timeslots) {
    if (!start || !end) {
      continue;
    }

    await db
      .insertInto("timeslots")
      .values({
        start,
        end,
      })
      .execute();
  }

  const added = await db.selectFrom("timeslots").selectAll().execute();
  console.log(chalk.green(`✔ Было добавлено ${added.length} записей в timeslots`));
}

async function seedBookings() {
  const existing = await db.selectFrom("bookings").selectAll().execute();

  if (existing.length > 0) {
    throw new Error("Таблица bookings уже содержит записи");
  }

  const areas = await db.selectFrom("areas").select(["id"]).execute();

  if (areas.length === 0) {
    throw new Error("Сначала добавьте данные в areas");
  }

  const now = Math.floor(Date.now() / 1000);
  const slots = [
    [60 * 60, 2 * 60 * 60],
    [3 * 60 * 60, 4 * 60 * 60],
    [5 * 60 * 60, 6 * 60 * 60],
  ];

  for (let i = 0; i < slots.length; i++) {
    const area = areas[i % areas.length];
    const slot = slots[i];

    if (!area || !slot || slot[0] === undefined || slot[1] === undefined) {
      continue;
    }

    const startOffset = slot[0];
    const endOffset = slot[1];

    await db
      .insertInto("bookings")
      .values({
        areaId: area.id,
        start: now + startOffset,
        end: now + endOffset,
        createdAt: now,
      })
      .execute();
  }

  const added = await db.selectFrom("bookings").selectAll().execute();
  console.log(chalk.green(`✔ Было добавлено ${added.length} записей в bookings`));
}
