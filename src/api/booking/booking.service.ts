import db from "../../database/connection.js";

export default class BookingService {
    static async findAll(params?: {
        limit?: number,
        offset?: number,
    }) {
        let query = db.selectFrom('bookings').selectAll()

        if (params?.limit !== undefined) {
            query = query.limit(params.limit)
        }

        if (params?.offset !== undefined) {
            query = query.offset(params.offset)
        }

        return await query.execute()

        // return await db.selectFrom('bookings').selectAll().execute()
    }

    static async create(payload: {
        timeslotId: number;
        createdAt: number;
    }) {
        return await db.insertInto('bookings').values(payload).returningAll().executeTakeFirst()
    }

    static async delete(id: number) {
        await db.deleteFrom('bookings').where('id', '=', id).execute()
    }
}