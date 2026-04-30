import * as v from 'valibot';
import { bookingsSchema, type BookingsSchema } from './booking.schema.js';

export default class BookingService {
    static async findAll() {
        const bookings: BookingsSchema = [];

        return v.parse(bookingsSchema, bookings);
    }
}