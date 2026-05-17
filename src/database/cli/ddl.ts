import { sql } from "kysely";
import chalk from "chalk";

import db from "../connection.js";

export async function createTables(isForce: boolean) {
  if (isForce) {
    await db.schema.dropTable("bookings").execute();
    await db.schema.dropTable("timeslots").execute();
    await db.schema.dropTable("areas").execute();
    console.log(chalk.yellow("! Таблицы форсировано удалены"));
  }

  await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("username", "text", (col) => col.unique())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable("areas")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.unique())
    .addColumn("capacity", "integer", (col) => col.notNull())
    .addColumn("hasPlasma", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("hasBoard", "integer", (col) => col.notNull().defaultTo(0))
    .addColumn("hasWifi", "integer", (col) => col.notNull().defaultTo(0))
    .execute();

  await db.schema
    .createTable("timeslots")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("start", "varchar(5)", (col) => col.notNull())
    .addColumn("end", "varchar(5)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("bookings")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("areaId", "integer", (col) => col.notNull())
    .addColumn("start", "integer", (col) => col.notNull())
    .addColumn("end", "integer", (col) => col.notNull())
    .addColumn("createdAt", "integer", (col) => col.notNull())
    .execute();
}

export async function resetTables(tables: string[]) {
  if (tables.length === 0) {
    await db.deleteFrom("bookings").execute();
    await db.deleteFrom("areas").execute();
    await db.deleteFrom("timeslots").execute();

    console.log(
      chalk.green(`✔ Таблица bookings была сброшена`),
      chalk.green(`\n✔ Таблица areas была сброшена`),
      chalk.green(`\n✔ Таблица timeslots была сброшена`)
    );
    return;
  }

  const errors = [];

  for (const table of tables) {
    try {
      switch (table) {
        case "areas":
          await db.deleteFrom("areas").execute();
          console.log(chalk.green(`✔ Таблица areas была сброшена`));
          break;
        case "timeslots":
          await db.deleteFrom("timeslots").execute();
          console.log(chalk.green(`✔ Таблица timeslots была сброшена`));
          break;
        case "bookings":
          await db.deleteFrom("bookings").execute();
          console.log(chalk.green(`✔ Таблица bookings была сброшена`));
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
