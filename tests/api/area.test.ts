import { assert, expect, test, describe, afterAll, beforeAll } from "vitest";
import request from "supertest";

import { app } from "../../src/main";

import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";
import db from "../../src/database/connection";

beforeAll(async () => {
  await createTables(false);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("/api/areas", () => {
  test("базовый случай", async () => {
    const response = await request(app).get("/api/areas");

    expect(response.status).toBe(200);

    expect(response.body.areas).toHaveLength(10);
  });
});
