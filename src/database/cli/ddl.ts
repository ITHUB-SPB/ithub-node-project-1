import connection from '../connection.js';
import chalk from 'chalk';

export function createTables(isForce: boolean) {
    if (isForce) {
        connection.exec(`
                drop table if exists users;
                drop table if exists bookings;
                drop table if exists timeslots;
                drop table if exists areas;
            `);
        console.log(chalk.yellow('! Таблицы форсировано удалены'));
    }

    connection.exec(`create table if not exists users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username STRING UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    connection.exec(`create table if not exists areas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title STRING UNIQUE
    )`);

    connection.exec(`create table if not exists timeslots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start INTEGER NOT NULL,
        end INTEGER NOT NULL,
    )`);

    connection.exec(`create table if not exists bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timeslotId INTEGER NOT NULL,
        userId INTEGER,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (timeslotId) REFERENCES timeslots(id) ON DELETE CASCADE
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )`);
}

export function resetTables(tables: string[]) {
    if (tables.length === 0) {
        connection.exec(`delete from users`);
        connection.exec(`delete from bookings`);
        connection.exec(`delete from areas`);
        connection.exec(`delete from timeslots`);
        console.log(
            chalk.green(`✔ Таблица users была сброшена`),
            chalk.green(`\n✔ Таблица bookings была сброшена`),
            chalk.green(`\n✔ Таблица areas была сброшена`),
            chalk.green(`\n✔ Таблица timeslots была сброшена`),
        );
        return;
    }

    const errors = [];

    for (const table of tables) {
        try {
            switch (table) {
                case 'users':
                    connection.exec(`delete from users`);
                    console.log(chalk.green(`✔ Таблица users была сброшена`));
                    break;
                case 'areas':
                    connection.exec(`delete from areas`);
                    console.log(chalk.green(`✔ Таблица areas была сброшена`));
                    break;
                case 'timeslots':
                    connection.exec(`delete from timeslots`);
                    console.log(chalk.green(`✔ Таблица timeslots была сброшена`));
                    break;
                case 'bookings':
                    connection.exec(`delete from bookings`);
                    console.log(
                        chalk.green(`✔ Таблица bookings была сброшена`),
                    );
                    break;
                default:
                    throw new Error(`Таблицы ${table} не существует`);
            }
        } catch (error) {
            errors.push({
                table,
                message: (error as Error).message,
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
