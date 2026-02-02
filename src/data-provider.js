import sqlite from 'node:sqlite'
import bookings from './data.json' with { type: "json" }

const connection = new sqlite.DatabaseSync('db.sqlite3')

connection.exec(`create table if not exists bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start INTEGER NOT NULL,
    end INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`)

connection.exec(`insert into bookings (start, end) values (
    1263168000,
    1263172000
)`)

connection.exec(`insert into bookings (start, end) values (
    1263180000,
    1263192000
)`)

const selectAllBookings = connection.prepare('select * from bookings')
console.log(selectAllBookings.all())


export { bookings }