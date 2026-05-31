import { expect, test, describe, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/main";
import db from "../../src/database/connection";
import { createTables } from "../../src/database/cli/ddl";
import seedTables from "../../src/database/cli/seed";

beforeAll(async () => {
  await createTables(true);
  await seedTables(["timeslots", "areas", "bookings"]);
});

afterAll(async () => {
  await db.schema.dropTable("bookings").execute();
  await db.schema.dropTable("timeslots").execute();
  await db.schema.dropTable("areas").execute();
});

describe("POST /api/bookings", () => {
  test("Успешное создание бронирования", async () => {
    const timeslotsResponse = await request(app).get("/api/timeslots");
    const timeslotId = timeslotsResponse.body.slots[0].id;
    
    const bookingData = {
      title: "Тестовое мероприятие",
      username: "Тестовый Пользователь",
      timeslotId: timeslotId
    };

    const response = await request(app)
      .post("/api/bookings")
      .send(bookingData)
      .expect(201);
    
    expect(response.body).toHaveProperty("booking");
    expect(response.body.booking).toHaveProperty("timeslotId", timeslotId);
    expect(response.body.booking).toHaveProperty("createdAt");
  });

  test("Возвращает 400 при отсутствии title", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({
        username: "Тестовый Пользователь",
        timeslotId: 1
      })
      .expect(400);
    
    expect(response.body).toHaveProperty("error");
  });

  test("Возвращает 400 при отсутствии username", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({
        title: "Тестовое мероприятие",
        timeslotId: 1
      })
      .expect(400);
    
    expect(response.body).toHaveProperty("error");
  });

  test("Возвращает 400 при невалидном timeslotId", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({
        title: "Тестовое мероприятие",
        username: "Тестовый Пользователь",
        timeslotId: "не число"
      })
      .expect(400);
    
    expect(response.body).toHaveProperty("error");
  });
});