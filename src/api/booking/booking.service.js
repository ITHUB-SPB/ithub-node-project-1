import * as v from "valibot";
import { Timeslot } from "./booking.model.js";
import * as schema from "./booking.schema.js";
import db from "../../database/connection.js";

export default class BookingService {
  static async findAll() {
    const bookings = await db.selectFrom("bookings").selectAll().execute();

    return bookings.map((bookingMap) => Timeslot.fromMapped(bookingMap));
  }

  static async create(payload) {
    const [newBooking] = await db
      .insertInto("bookings")
      .values({
        ...payload.toMapped(),
        created_at: Math.floor(Date.now() / 1000),
      })
      .returningAll()
      .execute();

    return newBooking;
  }

  static async delete(delId) {
    const { numDeletedRows } = await db
      .deleteFrom("bookings")
      .where("id", "=", delId)
      .executeTakeFirst();

    if (Number(numDeletedRows) === 0) {
      throw new Error(`Record with id ${delId} not found`);
    }
  }
}
