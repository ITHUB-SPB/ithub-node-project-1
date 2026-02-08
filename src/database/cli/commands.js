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
            spinner.succeed(chalk.purple('Таблицы созданы (или уже присутствовали)'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при создании таблиц: ${error.message}`));
        }
    } else if (command === 'reset') {
        try {
            resetTables();
            spinner.succeed(chalk.purple('Данные из таблиц успешно удалены'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при сбросе таблиц: ${error.message}`));
        }
    } else if (command === 'seed') {
        try {
            seedTables();
            spinner.succeed(chalk.purple('Таблицы наполнены фейковыми данными'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка при наполнении таблиц: ${error.message}`));
        }
    } else {
        spinner.fail(chalk.red('Команда не существует. Запросите help для информации'));
    }
}

export function help() {
    const createDesc = chalk.blue('\ndb:create - создание таблиц,')
    const resetDesc = chalk.blue('\ndb:reset - очистка таблицы,')
    const seedDesc = chalk.blue('\ndb:seed - наполнения таблиц фейкавыми данными')
    spinner.succeed(`Существующие команды db:(${chalk.white('create')};${chalk.gray('reset')};${chalk.black('seed')}), ${createDesc} ${resetDesc} ${seedDesc}`);
}

const command = process.argv[2]; 

if(command === 'help'){
    setTimeout(() => {
        help();
    }, 4000);
}else{
    setTimeout(() => {
        cli();
    }, 4000);
}