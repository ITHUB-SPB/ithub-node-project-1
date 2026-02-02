import sqlite from 'node:sqlite';
import { fakerRU as faker } from '@faker-js/faker';

function createTables() {
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

function resetTables() {
    const connection = new sqlite.DatabaseSync('db.sqlite3');

    connection.exec(`delete from users`);
}

function seedTables() {
    const connection = new sqlite.DatabaseSync('db.sqlite3');

    const usernames = faker.helpers.multiple(faker.internet.username, {
        count: 10,
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

function cli() {
    const command = process.argv[2];

    if (command === 'create') {
        try {
            createTables();
            console.log('Таблицы созданы (или уже присутствовали)');
        } catch (error) {
            console.error(`Ошибка при создании таблиц: ${error.message}`);
        }
    } else if (command === 'reset') {
        try {
            resetTables();
            console.log('Данные из таблиц успешно удалены');
        } catch (error) {
            console.error(`Ошибка при сбросе таблиц: ${error.message}`);
        }
    } else if (command === 'seed') {
        try {
            seedTables();
            console.log('Таблицы наполнены фейковыми данными');
        } catch (error) {
            console.error(`Ошибка при наполнении таблиц: ${error.message}`);
        }
    } else {
        console.log('Команда не существует. Запросите help для информации');
    }
}

cli();
