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

  const areas = faker.helpers.multiple(
    () => faker.number.int({ min: 1, max: 200 }),
    {
      count: 10,
    }
  );

  for (const areaNumber of areas) {
    await db
      .insertInto("areas")
      .values({
        title: `Помещение ${areaNumber}`,
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

  console.log(
    chalk.green(`✔ Было добавлено ${added.length} записей в timeslots`)
  );
}

async function seedBookings() {
  const existing = await db.selectFrom("bookings").selectAll().execute();

  if (existing.length > 0) {
    throw new Error("Таблица bookings уже содержит записи");
  }

  // const userIdentificators = connection.prepare('select id from users').all()
  // const startDates = faker.helpers.multiple(() => faker.date.past(), { count: 20 });
  // const endDates = faker.helpers.multiple(() => faker.date.recent(), { count: 20 });

  // const insertStatement = connection.prepare(
  //     'insert into bookings (start, end, userId) values (?, ?, ?)',
  // );

  // for (const elementIx in userIdentificators) {
  //     insertStatement.run(
  //         startDates[elementIx]!.getTime(),
  //         endDates[elementIx]!.getTime(),
  //         userIdentificators[elementIx]!['id']
  //     );
  // }

  // console.log(
  //     chalk.green(
  //         `✔ Было добавлено ${countStatement.all().length} записей в bookings`,
  //     ),
  // );
}
