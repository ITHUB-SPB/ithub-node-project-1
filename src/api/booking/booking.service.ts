import * as v from 'valibot';

import * as schema from './booking.schema.js';
import { db } from '../../database/connection.js'

type QueryParams = {
    limit?: number
    offset?: number
}

type CreatePayload = v.InferInput<typeof schema.newBookingInSchema>

export default class BookingService {
    static async findAll(queryParams: QueryParams = {}) {
        let statement = db.selectFrom('bookings').selectAll()

        if (queryParams.limit) {
            const offset = queryParams.offset || 0
            statement = statement.limit(queryParams.limit).offset(offset)
        }

        const bookings = await statement.execute()
        return v.parse(schema.bookingsSchema, bookings)
    }

    static async create(payload: CreatePayload) {
        const booking = await db.insertInto('bookings')
            .values({
                timeslotId: payload.timeslotId,
                userId: payload.userId || null,
                createdAt: new Date().toISOString()
            } as any)
            .returningAll()
            .executeTakeFirst()

        return booking
    }

    static async delete(id: number) {
        return db.deleteFrom('bookings').where('id', '=', id).execute()
    }
}
