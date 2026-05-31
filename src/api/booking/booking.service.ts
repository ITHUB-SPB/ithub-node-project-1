import type { Kysely } from "kysely";
import type { Database } from "../../database/interface.js";

export default class BookingService {
  constructor(private db: Kysely<Database>) {}

  async findAll(params?: { limit?: number; offset?: number }) {
    let query = this.db.selectFrom("bookings").selectAll();

    if (params?.limit !== undefined) {
      query = query.limit(params.limit);
    }
    if (params?.offset !== undefined) {
      query = query.offset(params.offset);
    }

    return await query.execute();
  }

  async create(payload: any) {
    return await this.db
      .insertInto("bookings")
      .values(payload)
      .returningAll()
      .executeTakeFirst();
  }

  async delete(id: number) {
    await this.db.deleteFrom("bookings").where("id", "=", id).execute();
  }

  async findOne(id: number) {
    return await this.db
      .selectFrom("bookings")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst() ?? null;
  }
}