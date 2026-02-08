import { createTables, resetTables } from './ddl.js';
import seedTables from './seed.js';

export default function cli() {
    const command = process.argv[2];

    if (command === 'create') {
        try {
            createTables();
            console.log('Таблицы созданы (или уже присутствовали)');
        } catch (error) {
            console.error(`Ошибка при создании таблиц: ${error.message}`);
        }
    } else if (command === 'reset') {
        const tablesToReset = process.argv.slice(3);

        try {
            resetTables(tablesToReset);
        } catch (error) {
            console.error(`Ошибка при сбросе таблиц: ${error.message}`);
        }
    } else if (command === 'seed') {
        const tablesToSeed = process.argv.slice(3);

        try {
            seedTables(tablesToSeed);
        } catch (error) {
            console.error(`Ошибка при наполнении таблиц: ${error.message}`);
        }
    } else {
        console.log('Команда не существует. Запросите help для информации');
    }
}

cli();
