import { createTables, resetTables } from './ddl.js';
import seedTables from './seed.js';
import chalk from 'chalk';

export default function cli() {
    const command = process.argv[2];
    if (command === 'create') {
        try {
            createTables();
            console.log(chalk.green.bold('Таблицы созданы (или уже присутствовали)'));
        } catch (error) {
            console.error(`Ошибка при создании таблиц: ${error.message}`);
        }
    } else if (command === 'reset') {
        try {
            resetTables();
            console.log(chalk.green.bold('Данные из таблиц успешно удалены'));
        } catch (error) {
            console.error(`Ошибка при сбросе таблиц: ${error.message}`);
        }
    } else if (command === 'seed') {
        try {
            seedTables();
            console.log(chalk.green.bold('Таблицы наполнены фейковыми данными'));
        } catch (error) {
            console.error(`Ошибка при наполнении таблиц: ${error.message}`);
        }
    } else {
        console.log('Команда не существует. Запросите help для информации');
    }
}

function help() {
    console.log(chalk.green.bold('хелп'));
}
export { help };
