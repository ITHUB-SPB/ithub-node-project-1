import sqlite from 'node:sqlite';
import path from 'node:path';

const isTestingEnv = process.env['VITEST'];

const dbPath = path.resolve(process.cwd(), 'db.sqlite3');

const connection = isTestingEnv
    ? new sqlite.DatabaseSync(':memory:')
    : new sqlite.DatabaseSync(dbPath);

export default connection;
