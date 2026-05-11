import { beforeEach, test, describe, vi } from 'vitest';

import { createTables } from '../../src/database/cli/ddl';
import connection from '../../src/database/connection';

describe.for([['users'], ['bookings']])(
    'создание таблицы %s',
    ([tableName]) => {
        test('создает таблицу в пустой бд', ({ expect }) => {
            connection.exec('drop table if exists users;');
            connection.exec('drop table if exists bookings;');

            createTables();

            expect(() => {
                const selectStatement = connection.prepare(
                    `select * from ${tableName}`,
                );
                selectStatement.all();
            }).not.throws();
        });

        test('отрабатывает без ошибок на существующей бд', ({ expect }) => {
            expect(() => createTables()).not.throws();
        });

        test('форсированный сброс работает на существующей бд', ({
            expect,
            skip,
        }) => {
            skip();
        });

        test('форсированный сброс не вызывает ошибок на пустой бд', ({
            expect,
            skip,
        }) => {
            skip();
        });
    },
);
