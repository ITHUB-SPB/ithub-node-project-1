import sqlite from 'node:sqlite';

export function createTables() {

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
}

export function resetTables() {
    const args = process.argv.slice(2);
    const tablesToSeed = args.length > 1 ? args : ['users', 'bookings'];

    const connection = new sqlite.DatabaseSync('db.sqlite3');

    if (tablesToSeed.includes('users')) {
        connection.exec(`delete from users`);
    } 
    if (tablesToSeed.includes('bookings')) {
        connection.exec(`delete from bookings`);
    }
    connection.close();
}