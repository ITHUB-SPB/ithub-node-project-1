import chalk from 'chalk';
import ora from 'ora';

import { createTables, resetTables } from './ddl.js';
import seedTables from './seed.js';
import help from './help.js';

const spinner = ora('Загрузка...').start();
spinner.spinner = 'binary';

export default function cli() {
    const command = process.argv[2];

    if (command === 'create') {
        try {
            createTables(
                process.argv.includes('--force') || process.argv.includes('-F'),
            );

            spinner.succeed(
                chalk.green('Таблицы созданы (или уже присутствовали)'),
            );
        } catch (error) {
            spinner.fail(
                chalk.red(`Ошибка при создании таблиц: ${error.message}`),
            );
        }
    } else if (command === 'reset') {
        const tablesToReset = process.argv.slice(3);

        try {
            resetTables(tablesToReset);
            spinner.stop();
        } catch (error) {
            spinner.fail(
                chalk.red(`Ошибка при сбросе таблиц: ${error.message}`),
            );
        }
    } else if (command === 'seed') {
        const tablesToSeed = process.argv.slice(3);

        try {
            seedTables(tablesToSeed);
            spinner.stop();
        } catch (error) {
            spinner.fail(
                chalk.red(`Ошибка при наполнении таблиц: ${error.message}`),
            );
        }
    } else if (command === 'help') {
        const helpCommand = process.argv[3] || 'general';
        try {
            help(helpCommand);
            spinner.stop();
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при вызове help: ${error.message}`));
        }
    } else {
        spinner.fail(
            chalk.red('Команда не существует. Запросите help для информации'),
        );
    }
}
