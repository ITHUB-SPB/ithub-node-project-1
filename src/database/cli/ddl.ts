import connection from "../connection.js";
import chalk from "chalk";

export function initTables(forceMode: boolean): void {
  if (forceMode) {
    connection.exec(`
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS bookings;
      DROP TABLE IF EXISTS timeslots;
      DROP TABLE IF EXISTS areas;
    `);
    console.log(chalk.yellow("Существующие таблицы были удалены"));
  }

  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS timeslots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_time VARCHAR(5) NOT NULL,
      end_time VARCHAR(5) NOT NULL
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slot_id INTEGER NOT NULL,
      user_id INTEGER,
      booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (slot_id) REFERENCES timeslots(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
}

export function truncateTables(targetTables: string[]): void {
  if (targetTables.length === 0) {
    connection.exec("DELETE FROM users");
    connection.exec("DELETE FROM bookings");
    connection.exec("DELETE FROM areas");
    connection.exec("DELETE FROM timeslots");
    console.log(
      chalk.green("Все таблицы были очищены")
    );
    return;
  }

  const failures = [];

  for (const table of targetTables) {
    try {
      switch (table) {
        case "users":
          connection.exec("DELETE FROM users");
          console.log(chalk.green(`Таблица users очищена`));
          break;
        case "areas":
          connection.exec("DELETE FROM areas");
          console.log(chalk.green(`Таблица areas очищена`));
          break;
        case "timeslots":
          connection.exec("DELETE FROM timeslots");
          console.log(chalk.green(`Таблица timeslots очищена`));
          break;
        case "bookings":
          connection.exec("DELETE FROM bookings");
          console.log(chalk.green(`Таблица bookings очищена`));
          break;
        default:
          throw new Error(`Таблица "${table}" не существует`);
      }
    } catch (error) {
      failures.push({ table, message: (error as Error).message });
    }
  }

  if (failures.length > 0) {
    const errorMessage = failures.map((e) => `- ${e.table}: ${e.message}`).join("\n");
    throw new Error(`Ошибки при очистке:\n${errorMessage}`);
  }
}