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

function seedUsers(connection){
    const usernames = faker.helpers.multiple(faker.internet.username, {
        count: 10,
    });

    const insertStatement = connection.prepare(
        'insert into users (username) values (?)',
    );

    for (const username of usernames) {
        insertStatement.run(username);
    }

    const countStatement = connection.prepare('select * from users').all();

    console.log(countStatement);
    console.log(chalk.red(`Было добавлено ${countStatement.length} пользователей`));
}

function seedBookings(connection) {
    const users = connection.prepare('SELECT id FROM users').all();
    
    if (users.length === 0) {
        console.log(chalk.purple('Нет пользователей для создания бронирований'));
        return;
    }

    const bookingCount = connection.prepare('SELECT COUNT(*) as count FROM bookings').get().count; 
    
    if (bookingCount > 0) {
        console.log(chalk.purple(`Таблица bookings уже содержит ${bookingCount} записей`));
        return;
    }

    const insertStatement = connection.prepare(
        'INSERT INTO bookings (start, end, userId, createdAt) VALUES (?, ?, ?, ?)'
    );

    for (let i = 0; i < 20; i++) {
        const randomUser = faker.helpers.arrayElement(users);
        
        const rn = Math.floor(Date.now() / 1000);
        const startTime = rn + faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 });
        const duration = faker.number.int({ min: 3600, max: 8 * 3600 });
        const createdAt = rn - faker.number.int({ min: 0, max: 30 * 24 * 60 * 60 });
        const endTime = startTime + duration;

        insertStatement.run(startTime, endTime, randomUser.id, createdAt);
    }
    
    const countStatement = connection.prepare('SELECT * FROM bookings');
    const bookings = countStatement.all();
    console.log(chalk.red(`Было добавлено ${bookings.length} бронирований`));
} 