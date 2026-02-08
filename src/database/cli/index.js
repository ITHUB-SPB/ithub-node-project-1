import { createTables, resetTables } from './ddl.js';
import seedTables from './seed.js';
import help from './help.js';
import chalk from 'chalk';

export default function cli() {
    const command = process.argv[2];

    if (command === 'create') {
        try {
            createTables(
                process.argv.includes('--force') || process.argv.includes('-F'),
            );
            console.log(
                chalk.green('Таблицы созданы (или уже присутствовали)'),
            );
        } catch (error) {
            console.error(
                chalk.red(`Ошибка при создании таблиц: ${error.message}`),
            );
        }
    } else if (command === 'reset') {
        const tablesToReset = process.argv.slice(3);

        try {
            resetTables(tablesToReset);
        } catch (error) {
            console.error(
                chalk.red(`Ошибка при сбросе таблиц: ${error.message}`),
            );
        }
    } else if (command === 'seed') {
        const tablesToSeed = process.argv.slice(3);

        try {
            seedTables(tablesToSeed);
        } catch (error) {
            console.error(
                chalk.red(`Ошибка при наполнении таблиц: ${error.message}`),
            );
        }
    } else if (command === 'help') {
        const helpCommand = process.argv[3] || 'general';
        try {
            help(helpCommand);
        } catch (error) {
            console.error(
                chalk.red(`Ошибка при вызове help: ${error.message}`),
            );
        }
    } else {
        console.log('Команда не существует. Запросите help для информации');
    }
}

cli();
