import chalk from 'chalk';

const cream = chalk.hex('#FFFDD0');
const denim = chalk.hex('#1560BD');
const rust = chalk.hex('#B7410E').italic;
const taupe = chalk.hex('#483C32');
const saffron = chalk.hex('#F4C430').italic;
const olive = chalk.hex('#808000');

export default function help(command) {
    switch (command) {
        case 'general':
            console.log(
                cream.bold(' Справка по командам:\n'),

                denim('Команда\t\tПараметры\t\t\tОписание\n'),

                rust('db:help\t'),
                taupe('{create || reset || seed}\t'),
                'Вывести справку по командам\n',

                rust('db:create\t'),
                taupe('{-- --force || -- -F}\t\t'),
                'Создание таблиц\n',

                rust('db:reset\t'),
                taupe('{users || bookings}\t\t'),
                'Сброс таблиц\n',

                rust('db:seed\t'),
                taupe('{users || bookings}\t\t'),
                'Наполнение таблиц фейковыми данными\n',
            );
            break;
        case 'create':
            console.log(
                ' Использование:',
                rust('db:create {flag}\n'),
                taupe('Команда создает таблицы в базе данных.\n\n'),

                'Флаги (по желанию):\n',
                saffron('-- -F, -- --force'),
                cream(
                    '  Создать таблицу, удалив ранее существующие таблицы\n\n',
                ),

                'Примеры использования:\n',
                olive('  db:create\n'),
                olive('  db:create -- -F\n'),
                olive('  db:create -- --force\n'),
            );
            break;
        case 'reset':
            console.log(
                ' Использование:',
                rust('db:reset {args}\n'),
                taupe('Команда сбрасывает таблицу в базе данных.\n'),
                taupe('Аргументы перечисляются через пробел.\n\n'),

                'Аргументы (по желанию):\n',
                saffron('users'),
                cream('     Сбросить таблицу users\n'),
                saffron('bookings'),
                cream('  Сбросить таблицу bookings\n\n'),

                'Примеры использования:\n',
                olive('  db:reset\n'),
                olive('  db:reset users\n'),
                olive('  db:reset bookings users\n'),
            );
            break;
        case 'seed':
            console.log(
                ' Использование:',
                rust('db:seed {args}\n'),
                taupe('Команда наполняет таблицу фейковыми данными.\n'),
                taupe('Аргументы перечисляются через пробел.\n\n'),

                'Аргументы (по желанию):\n',
                saffron('users'),
                cream('     Наполнить таблицу users\n'),
                saffron('bookings'),
                cream('  Наполнить таблицу bookings\n\n'),

                'Примеры использования:\n',
                olive('  db:seed\n'),
                olive('  db:seed users\n'),
                olive('  db:seed bookings users\n'),
            );
            break;
        default:
            throw new Error('Такой команды не существует.');
    }
}