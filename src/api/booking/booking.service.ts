import * as v from 'valibot';
import { bookingsSchema } from './booking.schema.js';

export default class BookingService {
  static async findAll() {
    const bookings = [];

    return v.parse(bookingsSchema, bookings);
  }
}