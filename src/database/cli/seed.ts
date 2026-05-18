import chalk from "chalk";
import db from "../connection.js";
import SQLite from 'better-sqlite3';

// Создаем прямое соединение для seed (better-sqlite3)
const connection = new SQLite('db.sqlite3');

export default function seedTables(tables: string[]) {
  if (tables.length === 0) {
    seedAmenities();
    seedTimeslots();
    seedAreas();
    return;
  }

  for (const table of tables) {
    switch (table) {
      case "amenities":
        seedAmenities();
        break;
      case "timeslots":
        seedTimeslots();
        break;
      case "areas":
        seedAreas();
        break;
      default:
        console.log(chalk.yellow(`! Таблица ${table} не найдена, пропускаем`));
    }
  }
}

function seedAmenities() {
  const countStatement = connection.prepare("SELECT COUNT(*) as count FROM amenities");
  const result = countStatement.get();
  
  if (result.count > 0) {
    console.log(chalk.yellow("! Таблица amenities уже содержит записи, пропускаем"));
    return;
  }

  const stmt = connection.prepare("INSERT INTO amenities (name, label) VALUES (?, ?)");
  const amenities = [
    ["plasma", "Плазма"],
    ["board", "Доска"],
    ["wifi", "Wi-Fi"],
  ];
  
  for (const [name, label] of amenities) {
    stmt.run(name, label);
  }
  
  console.log(chalk.green(`✔ Добавлено ${amenities.length} записей в amenities`));
}

function seedTimeslots() {
  const countStatement = connection.prepare("SELECT COUNT(*) as count FROM timeslots");
  const result = countStatement.get();
  
  if (result.count > 0) {
    console.log(chalk.yellow("! Таблица timeslots уже содержит записи, пропускаем"));
    return;
  }

  const stmt = connection.prepare("INSERT INTO timeslots (start, end) VALUES (?, ?)");
  const timeslots = [
    ["10:00", "11:00"],
    ["11:00", "12:00"],
    ["12:00", "13:00"],
    ["14:00", "15:00"],
    ["15:00", "16:00"],
    ["16:00", "18:00"],
  ];
  
  for (const [start, end] of timeslots) {
    stmt.run(start, end);
  }
  
  console.log(chalk.green(`✔ Добавлено ${timeslots.length} записей в timeslots`));
}

function seedAreas() {
  const countStatement = connection.prepare("SELECT COUNT(*) as count FROM areas");
  const result = countStatement.get();
  
  if (result.count > 0) {
    console.log(chalk.yellow("! Таблица areas уже содержит записи, пропускаем"));
    return;
  }

  const insertArea = connection.prepare("INSERT INTO areas (title, capacity) VALUES (?, ?)");
  const insertRoomAmenity = connection.prepare("INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)");
  
  const getAmenityId = (name: string) => {
    const stmt = connection.prepare("SELECT id FROM amenities WHERE name = ?");
    return stmt.get(name).id;
  };

  const rooms = [
    { title: "A-101", capacity: 24, amenities: ["plasma", "board", "wifi"] },
    { title: "A-102", capacity: 14, amenities: ["plasma", "wifi"] },
    { title: "B-140", capacity: 30, amenities: ["board", "wifi"] },
  ];

  for (const room of rooms) {
    const result = insertArea.run(room.title, room.capacity);
    const roomId = result.lastInsertRowid;

    for (const amenityName of room.amenities) {
      const amenityId = getAmenityId(amenityName);
      insertRoomAmenity.run(roomId, amenityId);
    }
  }
  
  console.log(chalk.green(`✔ Добавлено ${rooms.length} записей в areas`));
}