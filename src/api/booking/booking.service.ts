import db from "../../database/connection.js";

export default class BookingService {
  static async findAll() {
    return await db.selectFrom("bookings").selectAll().execute();
  }

  static async create(payload: { roomId: number; timeslotId: number }) {
    const existing = await db
      .selectFrom("bookings")
      .where("roomId", "=", payload.roomId)
      .where("timeslotId", "=", payload.timeslotId)
      .executeTakeFirst();

    if (existing) {
      throw new Error("Этот временной слот уже занят для выбранной комнаты");
    }

    return await db
      .insertInto("bookings")
      .values({
        roomId: payload.roomId,
        timeslotId: payload.timeslotId,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returningAll()
      .executeTakeFirst();
  }

  static async delete(id: number) {
    await db.deleteFrom("bookings").where("id", "=", id).execute();
  }
}