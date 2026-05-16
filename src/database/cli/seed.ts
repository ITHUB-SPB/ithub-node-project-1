import { fakerRU as faker } from "@faker-js/faker";
import db from "../connection.js";
import chalk from "chalk";

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

  for (let i = 0; i < 10; i++) {
    const areaNumber = faker.number.int({ min: 1, max: 200 });
    const capacities = ["1-4","5-10", "10-14", "15-20"];
    const randomCapacity =
      capacities[Math.floor(Math.random() * capacities.length)];

    await db
      .insertInto("areas")
      .values({
        title: `Помещение ${areaNumber}`,
        hasPlasma: faker.datatype.boolean() ? 1 : 0,
        hasBoard: faker.datatype.boolean() ? 1 : 0,
        hasWifi: faker.datatype.boolean() ? 1 : 0,
        capacity: randomCapacity,
      } as any)
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

  console.log(
    chalk.green(`✔ Было добавлено ${added.length} записей в timeslots`),
  );
}

async function seedBookings() {
  const existing = await db.selectFrom("bookings").selectAll().execute();

  if (existing.length > 0) {
    throw new Error("Таблица bookings уже содержит записи");
  }

  const areas = await db.selectFrom("areas").selectAll().execute();
  const timeslots = await db.selectFrom("timeslots").selectAll().execute();

  const bookings = [
    { areaId: 1, timeslotId: 1, name: "первый", theme: "первая тема" },
    { areaId: 1, timeslotId: 2, name: "второй", theme: "вторая тема" },
    { areaId: 2, timeslotId: 3, name: "третий", theme: "третья тема" },
  ];

  for (const booking of bookings) {
    const areaExist = areas.some(
      (a) => Number(a.id) === Number(booking.areaId),
    );
    const timeslotExist = timeslots.some(
      (t) => Number(t.id) === Number(booking.timeslotId),
    );

    if (areaExist && timeslotExist) {
      await db
        .insertInto("bookings")
        .values({
          timeslotId: booking.timeslotId,
          areaId: booking.areaId,
          userId: null,
          name: booking.name,
          theme: booking.theme,
        })
        .execute();
    }
  }

  const countStatement = await db.selectFrom("bookings").selectAll().execute();
  console.log(
    chalk.green(`✔ Было добавлено ${countStatement.length} записей в bookings`),
  );
}
