import { sql } from "kysely";
import chalk from "chalk";
import db from "../connection.js";

export async function createTables(isForce: boolean) {
  if (isForce) {
    await db.schema.dropTable("room_amenities").ifExists().execute();
    await db.schema.dropTable("amenities").ifExists().execute();
    await db.schema.dropTable("bookings").ifExists().execute();
    await db.schema.dropTable("timeslots").ifExists().execute();
    await db.schema.dropTable("areas").ifExists().execute();
    console.log(chalk.yellow("! Таблицы форсировано удалены"));
  }

  await db.schema
    .createTable("areas")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .addColumn("capacity", "integer", (col) => col.notNull().defaultTo(1))
    .execute();

  await db.schema
    .createTable("amenities")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text", (col) => col.notNull().unique())
    .addColumn("label", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("room_amenities")
    .addColumn("room_id", "integer", (col) =>
      col.notNull().references("areas.id").onDelete("cascade")
    )
    .addColumn("amenity_id", "integer", (col) =>
      col.notNull().references("amenities.id").onDelete("cascade")
    )
    .addPrimaryKeyConstraint("room_amenities_pk", ["room_id", "amenity_id"])
    .execute();

  await db.schema
    .createTable("timeslots")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("start", "varchar(5)", (col) => col.notNull())
    .addColumn("end", "varchar(5)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("bookings")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("timeslotId", "integer", (col) => col.notNull())
    .addColumn("roomId", "integer", (col) => col.notNull())
    .addColumn("userId", "integer")
    .addColumn("createdAt", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addForeignKeyConstraint("bookings_timeslot_id_foreign", ["timeslotId"], "timeslots", ["id"], (constraint) => constraint.onDelete("cascade"))
    .addForeignKeyConstraint("bookings_room_id_foreign", ["roomId"], "areas", ["id"], (constraint) => constraint.onDelete("cascade"))
    .execute();

  console.log(chalk.green("✔ Таблицы успешно созданы"));
}

export async function resetTables(tables: string[]) {
  if (tables.length === 0) {
    await db.deleteFrom("bookings").execute();
    await db.deleteFrom("room_amenities").execute();
    await db.deleteFrom("areas").execute();
    await db.deleteFrom("timeslots").execute();
    await db.deleteFrom("amenities").execute();
    console.log(chalk.green("✔ Все таблицы сброшены"));
    return;
  }

  for (const table of tables) {
    switch (table) {
      case "areas":
        await db.deleteFrom("areas").execute();
        console.log(chalk.green(`✔ Таблица areas сброшена`));
        break;
      case "timeslots":
        await db.deleteFrom("timeslots").execute();
        console.log(chalk.green(`✔ Таблица timeslots сброшена`));
        break;
      case "bookings":
        await db.deleteFrom("bookings").execute();
        console.log(chalk.green(`✔ Таблица bookings сброшена`));
        break;
      default:
        console.log(chalk.yellow(`! Таблица ${table} не найдена, пропускаем`));
    }
  }
}