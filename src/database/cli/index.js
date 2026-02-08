import {createTables, resetTables} from './ddl.js';
import seedTables from './seed.js';
import chalk from 'chalk';
import ora from 'ora';

const spinner = ora('Загрузка').start();

export default function cli() {
    const command = process.argv[2];

    if (command === 'create') {
        try {
            createTables();
            spinner.succeed(chalk.green('Таблицы созданы (или уже присутствовали)'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при создании таблиц: ${error.message}`));
        }
    } else if (command === 'reset') {
        try {
            resetTables();
            spinner.succeed(chalk.green('Данные из таблиц успешно удалены'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при сбросе таблиц: ${error.message}`));
        }
    } else if (command === 'seed') {
        try {
            seedTables();
            spinner.succeed(chalk.green('Таблицы наполнены фейковыми данными'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при наполнении таблиц: ${error.message}`));
        }
    } else {
        spinner.fail(chalk.red('Команда не существует. Запросите help для информации'));
    }
}

cli();