import connection from '../connection.js';

export function createTables() {
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

export function resetTables(tables) {
    if (tables.length === 0) {
        connection.exec(`delete from users`);
        connection.exec(`delete from bookings`);
        return;
    }

    const errors = [];

    for (const table of tables) {
        try {
            switch (table) {
                case 'users':
                    connection.exec(`delete from users`);
                    console.log(`Таблица users была сброшена`);
                    break;
                case 'bookings':
                    connection.exec(`delete from bookings`);
                    console.log(`Таблица bookings была сброшена`);
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
