import * as v from 'valibot';

import * as schema from './booking.schema.js';
import { db } from '../../database/connection.js'


export default class BookingService {
    static async findAll(queryParams = {}) {
        let statement = db.selectFrom('bookings').selectAll()

        if (queryParams.limit) {
            const offset = queryParams.offset || 0
            statement = statement.limit(queryParams.limit).offset(offset)
        }

        const bookings = await statement.execute()
        return v.parse(schema.bookingsSchema, bookings)
    }

    static async create(payload) {
        const booking = await db.insertInto('bookings')
            .values({
                timeslotId: payload.timeslotId,
                userId: payload.userId || null,
                createdAt: new Date().toISOString()
            })
            .returningAll()
            .executeTakeFirst()

        return booking
    }

    static async delete(idToDelete) {
        const booking = await db.deleteFrom('bookings')
            .where('id', '=', idToDelete)
            .executeTakeFirst()

        if (!booking) {
            throw new Error(`Record with id ${idToDelete} not found`)
        }
    }
}
