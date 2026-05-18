import * as v from "valibot";
import db from "../../database/connection.js";
import {
  bookingRecordSchema,
  bookingListSchema,
  type BookingRecord,
  type BookingFilters,
  type CreateBooking,
} from "./booking.schema.js";

export default class BookingService {
  static async add(payload: CreateBooking): Promise<BookingRecord> {
    const [record] = await db
      .insertInto("bookings")
      .values({
        timeslotId: payload.timeslotId,
        userId: payload.userId ?? null,
        createdAt: new Date().toISOString(),
      })
      .returningAll()
      .execute();

    const result = {
      id: record.id,
      timeslotId: record.timeslotId,
      userId: record.userId,
      createdAt: record.createdAt,
    };

    return v.parse(bookingRecordSchema, result);
  }

  static async getAll(): Promise<BookingRecord[]> {
    const records = await db.selectFrom("bookings").selectAll().execute();
    return v.parse(bookingListSchema, records);
  }

  static async getList(
    filters: BookingFilters
  ): Promise<{ data: BookingRecord[]; totalItems: number }> {
    let query = db.selectFrom("bookings").selectAll();

    if (filters.timeslotId) {
      query = query.where("timeslotId", "=", filters.timeslotId);
    }

    const offset = filters.offset ?? 0;
    if (filters.limit) {
      query = query.limit(filters.limit).offset(offset);
    }

    let countQuery = db
      .selectFrom("bookings")
      .select(db.fn.countAll<number>().as("total"));

    if (filters.timeslotId) {
      countQuery = countQuery.where("timeslotId", "=", filters.timeslotId);
    }

    const [records, countResult] = await Promise.all([
      query.execute(),
      countQuery.executeTakeFirst(),
    ]);

    return {
      data: v.parse(bookingListSchema, records),
      totalItems: Number(countResult?.total) || 0,
    };
  }

  static async getById(id: number): Promise<BookingRecord | null> {
    const record = await db
      .selectFrom("bookings")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!record) return null;
    return v.parse(bookingRecordSchema, record);
  }

  static async remove(id: number): Promise<void> {
    const result = await db
      .deleteFrom("bookings")
      .where("id", "=", id)
      .executeTakeFirst();

    if (Number(result.numDeletedRows) === 0) {
      throw new Error(`Бронирование с id ${id} не найдено`);
    }
  }
}