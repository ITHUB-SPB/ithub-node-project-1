import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import type { Database } from './interface.js';

const isTestingEnv = process.env['VITEST'];

const connection = isTestingEnv
    ? new SQLite(':memory:')
    : new SQLite('db.sqlite3');

const dialect = new SqliteDialect({
    database: connection,
});

const db = new Kysely<Database>({ dialect });

export default db;
