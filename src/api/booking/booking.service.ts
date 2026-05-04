import * as v from 'valibot';
import db from '../../database/connection.js';
import {
    bookingsSchema,
    bookingSchema,
    type BookingsSchema,
    type BookingSchema,
    type BookingsQuerySchema,
    type NewBookingInSchema,
} from './booking.schema.js';

export default class BookingService {
    static async create(payload: NewBookingInSchema): Promise<BookingSchema> {
        const [booking] = await db.insertInto('bookings')
            .values({
                timeslotId: payload.start,
                userId: null,
                createdAt: new Date().toISOString(),
            })
            .returningAll()
            .execute();

        const result = {
            id: booking.id,
            timeslotId: booking.timeslotId,
            userId: booking.userId,
            createdAt: booking.createdAt,
        };

        return v.parse(bookingSchema, result);
    }

    static async findAll(): Promise<BookingsSchema> {
        const bookings = await db.selectFrom('bookings')
            .selectAll()
            .execute();

        return v.parse(bookingsSchema, bookings);
    }

    static async findByFilters(query: BookingsQuerySchema): Promise<{ data: BookingsSchema; totalItems: number }> {
        let statement = db.selectFrom('bookings').selectAll();

        if (query.timeslotId) {
            statement = statement.where('timeslotId', '=', query.timeslotId);
        }

        const offset = query.offset || 0;
        if (query.limit) {
            statement = statement.limit(query.limit).offset(offset);
        }

        let countStatement = db.selectFrom('bookings')
            .select(db.fn.countAll<number>().as('total'));
        
        if (query.timeslotId) {
            countStatement = countStatement.where('timeslotId', '=', query.timeslotId);
        }

        const [bookings, countResult] = await Promise.all([
            statement.execute(),
            countStatement.executeTakeFirst(),
        ]);

        return {
            data: v.parse(bookingsSchema, bookings),
            totalItems: Number(countResult?.total) || 0,
        };
    }

    static async findOne(id: number): Promise<BookingSchema | null> {
        const booking = await db.selectFrom('bookings')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!booking) return null;

        return v.parse(bookingSchema, booking);
    }

    static async delete(id: number): Promise<void> {
        const result = await db.deleteFrom('bookings')
            .where('id', '=', id)
            .executeTakeFirst();

        if (Number(result.numDeletedRows) === 0) {
            throw new Error(`Record with id ${id} not found`);
        }
    }
}
