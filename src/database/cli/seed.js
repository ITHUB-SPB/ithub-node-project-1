import { fakerRU as faker } from '@faker-js/faker';
import connection from '../connection.js';

export default function seedTables() {
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
