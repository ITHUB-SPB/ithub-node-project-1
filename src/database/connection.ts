import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import type { Database as DB } from "./interface.js";

const isTestingEnv = process.env["VITEST"];

const sqlite = isTestingEnv
  ? new Database(":memory:")
  : new Database("db.sqlite3");

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({ database: sqlite }),
});