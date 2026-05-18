import { fakerRU as faker } from "@faker-js/faker";
import connection from "../connection.js";
import chalk from "chalk";

export default function fillTables(tables: string[]): void {
  if (tables.length === 0) {
    fillUsers();
    fillTimeslots();
    fillAreas();
    fillBookings();
    return;
  }

  const errors = [];

  for (const table of tables) {
    try {
      switch (table) {
        case "users":
          fillUsers();
          break;
        case "bookings":
          fillBookings();
          break;
        case "timeslots":
          fillTimeslots();
          break;
        case "areas":
          fillAreas();
          break;
        default:
          throw new Error(`Таблица "${table}" не существует`);
      }
    } catch (error) {
      errors.push({ table, message: (error as Error).message });
    }
  }

  if (errors.length > 0) {
    const errorMessage = errors.map((e) => `- ${e.table}: ${e.message}`).join("\n");
    throw new Error(`Ошибки при заполнении:\n${errorMessage}`);
  }
}

function fillUsers(): void {
  const checkStmt = connection.prepare("SELECT COUNT(*) as count FROM users");
  if (checkStmt.get().count > 0) {
    throw new Error("Таблица users уже содержит данные");
  }

  const usernames = faker.helpers.multiple(() => faker.internet.username(), { count: 15 });

  const insertStmt = connection.prepare("INSERT INTO users (username) VALUES (?)");

  for (const name of usernames) {
    insertStmt.run(name);
  }

  const finalCount = checkStmt.get().count;
  console.log(chalk.green(`Добавлено ${finalCount} записей в таблицу users`));
}

function fillAreas(): void {
  const checkStmt = connection.prepare("SELECT COUNT(*) as count FROM areas");
  if (checkStmt.get().count > 0) {
    throw new Error("Таблица areas уже содержит данные");
  }

  const areaNumbers = faker.helpers.multiple(() => faker.number.int({ min: 1, max: 300 }), {
    count: 12,
  });

  const insertStmt = connection.prepare("INSERT INTO areas (title) VALUES (?)");

  for (const num of areaNumbers) {
    insertStmt.run(`Конференц-зал ${num}`);
  }

  const finalCount = checkStmt.get().count;
  console.log(chalk.green(`Добавлено ${finalCount} записей в таблицу areas`));
}

function fillTimeslots(): void {
  const checkStmt = connection.prepare("SELECT COUNT(*) as count FROM timeslots");
  if (checkStmt.get().count > 0) {
    throw new Error("Таблица timeslots уже содержит данные");
  }

  const slotsData = [
    ["09:00", "10:00"],
    ["10:00", "11:00"],
    ["11:00", "12:00"],
    ["13:00", "14:00"],
    ["14:00", "15:00"],
    ["15:00", "16:00"],
    ["16:00", "17:00"],
    ["17:00", "18:00"],
  ];

  const insertStmt = connection.prepare("INSERT INTO timeslots (start_time, end_time) VALUES (?, ?)");

  for (const slot of slotsData) {
    insertStmt.run(slot[0], slot[1]);
  }

  const finalCount = checkStmt.get().count;
  console.log(chalk.green(`Добавлено ${finalCount} записей в таблицу timeslots`));
}

function fillBookings(): void {
  const checkStmt = connection.prepare("SELECT COUNT(*) as count FROM bookings");
  if (checkStmt.get().count > 0) {
    throw new Error("Таблица bookings уже содержит данные");
  }

  const users = connection.prepare("SELECT id FROM users").all() as { id: number }[];
  const slots = connection.prepare("SELECT id FROM timeslots").all() as { id: number }[];

  if (users.length === 0 || slots.length === 0) {
    throw new Error("Невозможно создать бронирования: отсутствуют пользователи или временные слоты");
  }

  const insertStmt = connection.prepare(
    "INSERT INTO bookings (slot_id, user_id, booked_at) VALUES (?, ?, ?)"
  );

  for (let i = 0; i < 25; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomSlot = slots[Math.floor(Math.random() * slots.length)];
    const randomDate = faker.date.recent({ days: 30 });

    insertStmt.run(randomSlot.id, randomUser.id, randomDate.toISOString());
  }

  const finalCount = checkStmt.get().count;
  console.log(chalk.green(`Добавлено ${finalCount} записей в таблицу bookings`));
}