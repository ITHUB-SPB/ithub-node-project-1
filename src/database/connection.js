import sqlite from 'node:sqlite';

const connection = new sqlite.DatabaseSync('db.sqlite3');

export default connection;
