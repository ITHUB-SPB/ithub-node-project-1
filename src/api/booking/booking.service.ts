import db from "../../database/connection.js";

export default class BookingService {
    static async findAll() {
        return await db.selectFrom('bookings').selectAll().execute()
    }

    static async create(payload: any) {
        return await db.insertInto('bookings').values(payload).returningAll().executeTakeFirst()
    }

    static async delete(id: number) {
        await db.deleteFrom('bookings').where('id', '=', id).execute()
    }
}