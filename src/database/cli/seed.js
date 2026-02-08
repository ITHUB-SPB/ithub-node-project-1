import { fakerRU as faker } from '@faker-js/faker';
import connection from '../connection.js';
import chalk from 'chalk';

export default function seedTables(tables) {
    if (tables.length === 0) {
        seedUsers();
        seedBookings();
        return;
    }

    const errors = [];

    for (const table of tables) {
        try {
            switch (table) {
                case 'users':
                    seedUsers();
                    break;

                case 'bookings':
                    seedBookings();
                    break;

                default:
                    throw new Error(`Таблицы ${table} не существует`);
            }
        } catch (error) {
            errors.push({
                table,
                message: error.message,
            });
        }
    }

    if (errors.length > 0) {
        const message = errors
            .map((e) => `- ${e.table}: ${e.message}`)
            .join('\n');

        throw new Error(`\n${message}`);
    }
}

function seedUsers() {
    const countStatement = connection.prepare('select * from users');
    if (countStatement.all().length > 0) {
        throw new Error('Таблица users уже содержит записи');
    }

    const usernames = faker.helpers.multiple(faker.internet.username, {
        count: 10,
    });

    const insertStatement = connection.prepare(
        'insert into users (username) values (?)',
    );

    for (const username of usernames) {
        insertStatement.run(username);
    }

    console.log(
        chalk.green(
            `✔ Было добавлено ${countStatement.all().length} записей в users`,
        ),
    );
}

function seedBookings() {
    const countStatement = connection.prepare('select * from bookings');
    if (countStatement.all().length > 0) {
        throw new Error('Таблица bookings уже содержит записи');
    }

    const userIdentificators = connection.prepare('select id from users').all();
    const startDates = faker.helpers.multiple(faker.date.past, { count: 20 });
    const endDates = faker.helpers.multiple(faker.date.recent, { count: 20 });

    const insertStatement = connection.prepare(
        'insert into bookings (start, end, userId) values (?, ?, ?)',
    );

    for (const elementIx in userIdentificators) {
        insertStatement.run(
            startDates[elementIx].getTime(),
            endDates[elementIx].getTime(),
            userIdentificators[elementIx].id,
        );
    }

    console.log(
        chalk.green(
            `✔ Было добавлено ${countStatement.all().length} записей в bookings`,
        ),
    );
}
