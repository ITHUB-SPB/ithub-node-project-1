import chalk from 'chalk';
import ora from 'ora';

import { createTables, resetTables } from './ddl.js';
import seedTables from './seed.js';

export default function cli() {
    const command = process.argv[2];
    const spinner = ora({ text: 'Выполнение...', color: 'cyan' });

    if (command === 'create') {
        const forceFlag =
            process.argv.includes('--force') || process.argv.includes('-F');
        spinner.start('Создание таблиц...');

        try {
            createTables(forceFlag);
            spinner.succeed(chalk.green(' Таблицы созданы'));
        } catch (error) {
            spinner.fail(chalk.red(` Ошибка: ${error.message}`));
            process.exit(1);
        }
    } else if (command === 'reset') {
        const tablesToReset = process.argv.slice(3);
        spinner.start('Сброс таблиц...');

        try {
            resetTables(
                tablesToReset.length > 0
                    ? tablesToReset
                    : ['users', 'bookings'],
            );
            spinner.succeed(chalk.green('Таблицы сброшены'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка: ${error.message}`));
            process.exit(1);
        }
    } else if (command === 'seed') {
        const tablesToSeed = process.argv.slice(3);
        spinner.start('Наполнение таблиц...');

        try {
            seedTables(
                tablesToSeed.length > 0 ? tablesToSeed : ['users', 'bookings'],
            );
            spinner.succeed(chalk.green('✅ Таблицы наполнены'));
        } catch (error) {
            spinner.fail(chalk.red(`Ошибка: ${error.message}`));
            process.exit(1);
        }
    } else if (command === 'help' || !command) {
        showHelp();
    } else {
        console.log(chalk.red(` Неизвестная команда: ${command}`));
        showHelp();
        process.exit(1);
    }
}

function showHelp() {
    console.log(chalk.blue.bold('\n=== CLI для управления базой данных ===\n'));

    console.log(chalk.yellow('Доступные команды:'));
    console.log(
        chalk.green('  db:create [--force]        ') + 'Создать таблицы',
    );
    console.log(
        chalk.green('  db:reset [tables]          ') + 'Очистить таблицы',
    );
    console.log(
        chalk.green('  db:seed [tables]           ') +
            'Наполнить таблицы данными',
    );
    console.log(
        chalk.green('  db:help                    ') + 'Показать эту справку\n',
    );

    console.log(chalk.yellow('Аргументы:'));
    console.log('  --force или -F           Удалить таблицы перед созданием');
    console.log('  users                    Работать с таблицей пользователей');
    console.log(
        '  bookings                 Работать с таблицей бронирований\n',
    );

    console.log(chalk.yellow('Примеры:'));
    console.log('  npm run db:create -- --force');
    console.log('  npm run db:seed users');
    console.log('  npm run db:reset users bookings');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    cli();
}