import chalk from 'chalk';

export default function help(command) {
    switch (command) {
        case 'general':
            console.log(
                chalk.hex('#C0C0C0').bold(' Справка по командам:\n'),

                chalk.hex('#B0E0E6')('Команда\t\tПараметры\t\t\tОписание\n'),

                chalk.hex('#FFC0CB').italic('db:help\t'),
                chalk.hex('#696969')('{create || reset || seed}\t'),
                'Вывести справку по командам\n',

                chalk.hex('#FFC0CB').italic('db:create\t'),
                chalk.hex('#696969')('{-- --force || -- -F}\t\t'),
                'Создание таблиц\n',

                chalk.hex('#FFC0CB').italic('db:reset\t'),
                chalk.hex('#696969')('{users || bookings}\t\t'),
                'Сброс таблиц\n',

                chalk.hex('#FFC0CB').italic('db:seed\t'),
                chalk.hex('#696969')('{users || bookings}\t\t'),
                'Наполнение таблиц фейковыми данными\n',
            );
            break;
        case 'create':
            console.log(
                ' Использование:',
                chalk.hex('#FFC0CB').italic('db:create {flag}\n'),
                chalk.hex('#696969')(
                    'Команда создает таблицы в базе данных.\n\n',
                ),

                'Флаги (по желанию):\n',
                chalk.yellow.italic('-- -F, -- --force'),
                chalk.hex('#C0C0C0')(
                    '  Создать таблицу, удалив ранее существующие таблицы\n\n',
                ),

                'Примеры использования:\n',
                chalk.green('  db:create\n'),
                chalk.green('  db:create -- -F\n'),
                chalk.green('  db:create -- --force\n'),
            );
            break;
        case 'reset':
            console.log(
                ' Использование:',
                chalk.hex('#FFC0CB').italic('db:reset {args}\n'),
                chalk.hex('#696969')(
                    'Команда сбрасывает таблицу в базе данных.\n',
                ),
                chalk.hex('#696969')(
                    'Аргументы перечисляются через пробел.\n\n',
                ),

                'Аргументы (по желанию):\n',
                chalk.yellow.italic('users'),
                chalk.hex('#C0C0C0')('     Сбросить таблицу users\n'),
                chalk.yellow.italic('bookings'),
                chalk.hex('#C0C0C0')('  Сбросить таблицу bookings\n\n'),

                'Примеры использования:\n',
                chalk.green('  db:reset\n'),
                chalk.green('  db:reset users\n'),
                chalk.green('  db:reset bookings users\n'),
            );
            break;
        case 'seed':
            console.log(
                ' Использование:',
                chalk.hex('#FFC0CB').italic('db:seed {args}\n'),
                chalk.hex('#696969')(
                    'Команда наполняет таблицу фейковыми данными.\n',
                ),
                chalk.hex('#696969')(
                    'Аргументы перечисляются через пробел.\n\n',
                ),

                'Аргументы (по желанию):\n',
                chalk.yellow.italic('users'),
                chalk.hex('#C0C0C0')('     Наполнить таблицу users\n'),
                chalk.yellow.italic('bookings'),
                chalk.hex('#C0C0C0')('  Наполнить таблицу bookings\n\n'),

                'Примеры использования:\n',
                chalk.green('  db:seed\n'),
                chalk.green('  db:seed users\n'),
                chalk.green('  db:seed bookings users\n'),
            );
            break;
        default:
            throw new Error('Такой команды не существует.');
    }
}
