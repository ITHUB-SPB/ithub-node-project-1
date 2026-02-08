import chalk from 'chalk';
import sqlite from 'node:sqlite';
import { fakerRU as faker } from '@faker-js/faker';

export default function seedTables() {
    const args = process.argv.slice(2);

    const tablesToSeed = args.length > 1 ? args : ['users', 'bookings'];

    const connection = new sqlite.DatabaseSync('db.sqlite3');

    if (tablesToSeed.includes('users')) {
        seedUsers(connection);
    }
    if (tablesToSeed.includes('bookings')) {
        seedBookings(connection);
    }
    connection.close();
}

function seedUsers(connection) {
    // Проверяем, есть ли уже записи
    const countStatement = connection.prepare('SELECT COUNT(*) as count FROM users');
    const userCount = countStatement.get().count;
    
    if (userCount > 0) {
        console.log(chalk.yellow(`Таблица users уже содержит ${userCount} записей`));
        return;
    }
    
    const usernames = faker.helpers.multiple(faker.internet.username, {
        count: 10,
    });
    
    const insertStatement = connection.prepare(
        'INSERT INTO users (username) VALUES (?)'
    );
    
    for (const username of usernames) {
        insertStatement.run(username);
    }
    
    console.log(chalk.green(`Было добавлено ${usernames.length} пользователей`));
}

function seedBookings(connection) {
    const getUsersStatement = connection.prepare('SELECT id FROM users');
    const users = getUsersStatement.all();

    if (users.length === 0) {
        console.log(
            chalk.yellow('Нет пользователей для создания бронирований'),
        );
        return;
    }

    const cs = connection.prepare('SELECT COUNT(*) as count FROM bookings');
    const bookingCount = cs.get().count;

    if (bookingCount > 0) {
        console.log(
            chalk.yellow(
                `Таблица bookings уже содержит ${bookingCount} записей`,
            ),
        );
        return;
    }

    const insertStatement = connection.prepare(
        'INSERT INTO bookings (start, end, userId, createdAt) VALUES (?, ?, ?, ?)',
    );

    for (let i = 0; i < 20; i++) {
        const randomUser = faker.helpers.arrayElement(users);

        const now = Math.floor(Date.now() / 1000);
        const startTime =
            now + faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 });
        const duration = faker.number.int({ min: 3600, max: 8 * 3600 });
        const endTime = startTime + duration;
        const createdAt =
            now - faker.number.int({ min: 0, max: 7 * 24 * 60 * 60 });

        insertStatement.run(startTime, endTime, randomUser.id, createdAt);
    }

    const countStatement = connection.prepare('SELECT * FROM bookings');
    const bookings = countStatement.all();
    console.log(chalk.green(`Было добавлено ${bookings.length} бронирований`));
}
