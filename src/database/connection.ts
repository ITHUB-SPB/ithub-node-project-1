import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import type { Database } from "./interface.js";

const isTestingEnv = process.env["VITEST"];

const sqliteConnection = isTestingEnv
  ? new SQLite(":memory:")
  : new SQLite("db.sqlite3");

const dialect = new SqliteDialect({
  database: sqliteConnection,
});

const db = new Kysely<Database>({ dialect });

type DbWithSqlite = Kysely<Database> & {
  exec: SQLite.Database["exec"];
  prepare: SQLite.Database["prepare"];
};

const connection = db as DbWithSqlite;
connection.exec = sqliteConnection.exec.bind(sqliteConnection);
connection.prepare = sqliteConnection.prepare.bind(sqliteConnection);

export default connection;
