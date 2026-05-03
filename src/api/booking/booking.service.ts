import type { Kysely } from "kysely";
import type { Database } from "../../database/interface.js";
import type { Booking } from "./booking.schema.js";
import * as v from "valibot";
import { createBookingSchema } from "./booking.schema.js";

export default class BookingService {
  static delete(id: number) {
    throw new Error("Method not implemented.");
  }
  static create(arg0: { createdAt: number; start: number; end: number; }) {
    throw new Error("Method not implemented.");
  }
  constructor(private db: Kysely<Database>) {}


  async findAll(params?: {
    limit?: number;
    offset?: number;
    timeslotId?: number;
  }): Promise<Booking[]> {
    let query = this.db
      .selectFrom("bookings")
      .innerJoin("timeslots", "bookings.timeslotId", "timeslots.id")
      .select([
        "bookings.id",
        "bookings.timeslotId",
        "bookings.createdAt",
        "timeslots.start",
        "timeslots.end",
      ])
      .orderBy("bookings.createdAt", "desc");

    if (params?.timeslotId) {
      query = query.where("bookings.timeslotId", "=", params.timeslotId);
    }
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.offset(params.offset);
    }

    const rows = await query.execute();

    return rows.map((row) => ({
      id: row.id,
      areaId: 1,
      timeslotId: row.timeslotId,
      start: row.start,
      end: row.end,
      createdAt: row.createdAt,
    }));
  }

  async findOne(id: number): Promise<Booking | null> {
    const row = await this.db
      .selectFrom("bookings")
      .innerJoin("timeslots", "bookings.timeslotId", "timeslots.id")
      .select([
        "bookings.id",
        "bookings.timeslotId",
        "bookings.createdAt",
        "timeslots.start",
        "timeslots.end",
      ])
      .where("bookings.id", "=", id)
      .executeTakeFirst();

    if (!row) return null;

    return {
      id: row.id,
      areaId: 1,
      timeslotId: row.timeslotId,
      start: row.start,
      end: row.end,
      createdAt: row.createdAt,
    };
  }

  async create(payload: unknown): Promise<Booking> {
    const data = v.parse(createBookingSchema, payload);

    const result = await this.db
      .insertInto("bookings")
      .values({
        timeslotId: data.timeslotId,
        userId: null,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returning(["id", "timeslotId", "createdAt"])
      .executeTakeFirstOrThrow();

    const timeslot = await this.db
      .selectFrom("timeslots")
      .select(["start", "end"])
      .where("id", "=", result.timeslotId)
      .executeTakeFirstOrThrow();

    return {
      id: result.id,
      areaId: data.areaId,
      timeslotId: result.timeslotId,
      start: timeslot.start,
      end: timeslot.end,
      createdAt: result.createdAt,
    };
  }

  async delete(id: number): Promise<void> {
    const result = await this.db
      .deleteFrom("bookings")
      .where("id", "=", id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      throw new Error(`Booking with id ${id} not found`);
    }
  }
}