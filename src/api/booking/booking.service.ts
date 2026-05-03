import * as v from "valibot";
import db from "../../database/connection.js";
import {
  bookingSchema,
  bookingsSchema,
  type BookingsQuerySchema,
  type CreateBookingSchema,
} from "./booking.schema.js";

export default class BookingService {
  static async findAll(queryParams: BookingsQuerySchema) {
    let statement = db
      .selectFrom("bookings")
      .selectAll()
      .orderBy("bookings.id");

    if (queryParams.areaId) {
      statement = statement.where("bookings.areaId", "=", queryParams.areaId);
    }

    if (queryParams.timeslotId) {
      statement = statement.where(
        "bookings.timeslotId",
        "=",
        queryParams.timeslotId,
      );
    }

    if (queryParams.limit) {
      statement = statement.limit(queryParams.limit);
    }

    if (queryParams.offset !== undefined) {
      statement = statement.offset(queryParams.offset);
    }

    const bookings = await statement.execute();

    return v.parse(bookingsSchema, bookings);
  }

  static async findOne(id: number) {
    const booking = await db
      .selectFrom("bookings")
      .selectAll()
      .where("bookings.id", "=", id)
      .executeTakeFirst();

    if (!booking) {
      return null;
    }

    return v.parse(bookingSchema, booking);
  }

  static async create(payload: CreateBookingSchema) {
    const booking = await db
      .insertInto("bookings")
      .values({
        areaId: payload.areaId,
        timeslotId: payload.timeslotId,
        userId: payload.userId,
        createdAt: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return v.parse(bookingSchema, booking);
  }

  static async delete(id: number) {
    const booking = await this.findOne(id);

    if (!booking) {
      return false;
    }

    await db.deleteFrom("bookings").where("bookings.id", "=", id).execute();

    return true;
  }
}
