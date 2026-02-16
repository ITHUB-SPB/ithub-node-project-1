import chalk from 'chalk';

const lightGray = chalk.hex('#C0C0C0');
const lightBlue = chalk.hex('#B0E0E6');
const pinkItalic = chalk.hex('#FFC0CB').italic;
const gray = chalk.hex('#696969');
const yellowItalic = chalk.yellow.italic;
const green = chalk.green;

export default function help(command) {
    switch (command) {
        case 'general':
            console.log(
                lightGray.bold(' Справка по командам:\n'),

                lightBlue('Команда\t\tПараметры\t\t\tОписание\n'),

                pinkItalic('db:help\t'),
                gray('{create || reset || seed}\t'),
                'Вывести справку по командам\n',

                pinkItalic('db:create\t'),
                gray('{-- --force || -- -F}\t\t'),
                'Создание таблиц\n',

                pinkItalic('db:reset\t'),
                gray('{users || bookings}\t\t'),
                'Сброс таблиц\n',

                pinkItalic('db:seed\t'),
                gray('{users || bookings}\t\t'),
                'Наполнение таблиц фейковыми данными\n',
            );
            break;
        case 'create':
            console.log(
                ' Использование:',
                pinkItalic('db:create {flag}\n'),
                gray('Команда создает таблицы в базе данных.\n\n'),

                'Флаги (по желанию):\n',
                yellowItalic('-- -F, -- --force'),
                lightGray(
                    '  Создать таблицу, удалив ранее существующие таблицы\n\n',
                ),

                'Примеры использования:\n',
                green('  db:create\n'),
                green('  db:create -- -F\n'),
                green('  db:create -- --force\n'),
            );
            break;
        case 'reset':
            console.log(
                ' Использование:',
                pinkItalic('db:reset {args}\n'),
                gray('Команда сбрасывает таблицу в базе данных.\n'),
                gray('Аргументы перечисляются через пробел.\n\n'),

                'Аргументы (по желанию):\n',
                yellowItalic('users'),
                lightGray('     Сбросить таблицу users\n'),
                yellowItalic('bookings'),
                lightGray('  Сбросить таблицу bookings\n\n'),

                'Примеры использования:\n',
                green('  db:reset\n'),
                green('  db:reset users\n'),
                green('  db:reset bookings users\n'),
            );
            break;
        case 'seed':
            console.log(
                ' Использование:',
                pinkItalic('db:seed {args}\n'),
                gray('Команда наполняет таблицу фейковыми данными.\n'),
                gray('Аргументы перечисляются через пробел.\n\n'),

                'Аргументы (по желанию):\n',
                yellowItalic('users'),
                lightGray('     Наполнить таблицу users\n'),
                yellowItalic('bookings'),
                lightGray('  Наполнить таблицу bookings\n\n'),

                'Примеры использования:\n',
                green('  db:seed\n'),
                green('  db:seed users\n'),
                green('  db:seed bookings users\n'),
            );
            break;
        default:
            throw new Error('Такой команды не существует.');
    }
}
