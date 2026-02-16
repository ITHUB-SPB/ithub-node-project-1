import sqlite from 'node:sqlite';

const isTestingEnv = process.env.VITEST;

const connection = isTestingEnv
    ? new sqlite.DatabaseSync(':memory:')
    : new sqlite.DatabaseSync('db.sqlite3');

export default connection;
