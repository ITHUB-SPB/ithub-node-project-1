import sqlite from 'node:sqlite';
import { fakerRU as faker } from '@faker-js/faker';

function seedUsers(connection) {
    const usernames = faker.helpers.multiple(faker.internet.username, {
        count: 20,
    });

    const insertStatement = connection.prepare(
        'insert into users (username) values (?)',
    );

    for (const username of usernames) {
        insertStatement.run(username);
    }

    const countStatement = connection.prepare('select * from users');
    console.log(countStatement.all());
    console.log(`Было добавлено ${countStatement.all().length} пользователей`);
}

function seedBookings(connection) {
    const users = connection.prepare('SELECT id FROM users').all();

    const insertBooking = connection.prepare(
        'INSERT INTO bookings (start, end, userId) VALUES (?, ?, ?)',
    );

    const bookings = [];

    for (let i = 0; i < 20; i++) {
        const user = faker.helpers.arrayElement(users);

        const bookingDate = faker.date.soon({});
        const startHour = faker.number.int({ min: 1, max: 10 }); 

        const start = new Date(bookingDate);
        start.setHours(startHour, 0, 0, 0);

        const durationHours = faker.number.int({ min: 1, max: 2 });
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

        insertBooking.run(
            Math.floor(start.getTime() / 1000),
            Math.floor(end.getTime() / 1000),
            user.id,
        );

        bookings.push({
            id: i + 1,
            userId: user.id,
            start: start,
            end: end,
        });
    }
}

export default function seedTables() {
    const connection = new sqlite.DatabaseSync('db.sqlite3');

    seedUsers(connection);
    seedBookings(connection);
}
