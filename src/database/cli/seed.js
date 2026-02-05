import sqlite from 'node:sqlite';
import { fakerRU as faker } from '@faker-js/faker';

export default function seedTables() {
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