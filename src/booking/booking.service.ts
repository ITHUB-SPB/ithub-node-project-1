import * as v from "valibot";
import { Timeslot } from "../timeslot/timeslot.model.js";
import type { Booking } from "./booking.schema.js";
import * as schema from "./booking.schema.js";
import connection from "../database/connection.js";
import { createBookingSchema } from "./booking.schema.js";

const bookings: any[] = [];

export default class BookingService {
  static findAll(): Booking[] {
    return bookings.map((b) => ({
      id: b.id,
      areaId: b.areaId,
      timeslotId: b.timeslotId,
      start: b.start,
      end: b.end,
      createdAt: b.createdAt,
    }));
  }

  static create(payload: unknown): Booking {
    const data = v.parse(createBookingSchema, payload);

    const newBooking: Booking = {
      id: Date.now(),
      ...data,
      createdAt: Math.floor(Date.now() / 1000),
    };

    bookings.push(newBooking);
    return newBooking;
  }

  static delete(idToDelete: number): void {
    const indexToDelete = bookings.findIndex(
      (booking) => booking.id === idToDelete,
    );

    if (indexToDelete === -1) {
      throw new Error(`Record with id ${idToDelete} not found`);
    }

    bookings.splice(indexToDelete, 1);
  }
}
