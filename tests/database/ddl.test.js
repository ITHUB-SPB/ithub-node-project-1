import { beforeEach, test, describe } from 'vitest';
import { createTables, resetTables } from '../../src/database/cli/ddl';
import connection from '../../src/database/connection';

describe.for([['areas'], ['timeslots'], ['bookings']])(
    'создание таблицы %s',
    ([tableName]) => {
        test('создает таблицу в пустой бд', async ({ expect }) => {
            connection.exec(`drop table if exists ${tableName};`);

            await createTables(false);

            expect(() => {
                const selectStatement = connection.prepare(
                    `select * from ${tableName}`,
                );
                selectStatement.all();
            }).not.toThrow();
        });

        test('отрабатывает без ошибок на существующей бд', async ({ expect }) => {
            await expect(createTables(false)).resolves.not.toThrow();
        });

        test('форсированный сброс работает на существующей бд', async ({ expect }) => {
            await createTables(false);
            
            const tableExists = connection.prepare(
                `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`
            ).get();
            expect(tableExists).toBeDefined();
            
            await expect(createTables(true)).resolves.not.toThrow();
        });

        test('форсированный сброс не вызывает ошибок на пустой бд', async ({ expect }) => {
            connection.exec(`drop table if exists ${tableName};`);
            
            await expect(createTables(true)).resolves.not.toThrow();
        });
    },
);

describe('resetTables', () => {
    beforeEach(async () => {
        await createTables(true);
        connection.exec(`INSERT INTO areas (title, capacity) VALUES ('Тестовая комната', 10)`);
    });
    
    test('сбрасывает указанную таблицу', async ({ expect }) => {
        let count = connection.prepare('SELECT COUNT(*) as count FROM areas').get();
        expect(count.count).toBeGreaterThan(0);
        
        await resetTables(['areas']);
        
        count = connection.prepare('SELECT COUNT(*) as count FROM areas').get();
        expect(count.count).toBe(0);
    });
    
    test('выбрасывает ошибку для несуществующей таблицы', async ({ expect }) => {
        await expect(resetTables(['nonexistent_table'])).rejects.toThrow();
    });
});