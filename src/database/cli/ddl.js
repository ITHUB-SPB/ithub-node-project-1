import sqlite from 'node:sqlite';
import ora from 'ora';
import chalk from 'chalk';

function createTables() {
    const spinner = ora("загрузка").start();
    
    try {
        const connection = new sqlite.DatabaseSync('db.sqlite3');

        connection.exec(`create table if not exists users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username STRING UNIQUE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        connection.exec(`create table if not exists bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start INTEGER NOT NULL,
            end INTEGER NOT NULL,
            userId INTEGER,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )`);

        spinner.succeed("готово");
    } catch (error) {
        spinner.fail("ошибка");
        throw error;
    }
}
// function createTables() {
//     const connection = new sqlite.DatabaseSync('db.sqlite3');

//     connection.exec(`create table if not exists users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username STRING UNIQUE,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )`);

//     connection.exec(`create table if not exists bookings (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         start INTEGER NOT NULL,
//         end INTEGER NOT NULL,
//         userId INTEGER,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
//     )`);
// }

function resetTables() {
    const connection = new sqlite.DatabaseSync('db.sqlite3');
      const args = process.argv.slice(3);
    
    if (args.length === 0) {
        connection.exec(`delete from bookings`);
        connection.exec(`delete from users`);
        console.log("удалил буки и юзеры");
        return;
    }
    
    const hasUsers = args.includes('users');
    const hasBookings = args.includes('bookings');
    
    if (hasBookings) {
        connection.exec(`delete from bookings`);
        console.log("удалил буки");
    }
    
    if (hasUsers) {
        connection.exec(`delete from users`);
        console.log("удалил юзеры");

    }
}

export { createTables, resetTables };
