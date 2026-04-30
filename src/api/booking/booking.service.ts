import * as v from 'valibot';
import connection from '../../database/connection.js';
import { bookingsSchema } from './booking.schema.js';

export default class BookingService {
  static async findAll() {
    const bookings = await connection
      .selectFrom('bookings')
      .selectAll()
      .execute();

    return v.parse(bookingsSchema, bookings);
  }
}