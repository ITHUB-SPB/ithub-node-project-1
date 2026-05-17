import db from "../../database/connection.js";

type FindAllParams = {
  areaId?: number;
  limit?: number;
  offset?: number;
};

type CreateBookingPayload = {
  areaId: number;
  start: number;
  end: number;
  createdAt: number;
};

export default class BookingService {
  static async findAll(params: FindAllParams = {}) {
    let query = db.selectFrom("bookings").selectAll().orderBy("bookings.start");

    if (params.areaId !== undefined) {
      query = query.where("bookings.areaId", "=", params.areaId);
    }

    if (params.limit !== undefined) {
      query = query.limit(params.limit);
    }

    if (params.offset !== undefined) {
      query = query.offset(params.offset);
    }

    return await query.execute();
  }

  static async create(payload: CreateBookingPayload) {
    return await db
      .insertInto("bookings")
      .values(payload)
      .returningAll()
      .executeTakeFirst();
  }

  static async delete(id: number) {
    await db.deleteFrom("bookings").where("id", "=", id).execute();
  }
}
