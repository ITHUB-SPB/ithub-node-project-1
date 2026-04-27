import * as v from 'valibot';

import { Timeslot } from './booking.model.js';
import * as schema from './booking.schema.js';
import connection from '../../database/connection.js'


export default class BookingService {
    static findAll() {
        return bookings.map((bookingMap) =>
            Timeslot.fromMapped(bookingMap),
        );            
    }

    static create(payload) {
        bookings.push({
            ...payload.toMapped(),
            createdAt: Math.floor(Date.now() / 1000),
        });

        return bookings.at(-1)
    }

    static delete(idToDelete) {
        const indexToDelete = bookings.findIndex(
            (booking) => booking.id === idToDelete,
        );

        if (indexToDelete === -1) {
            throw new Error(`Record with id ${idToDelete} not found`)
        }

        bookings.splice(indexToDelete, 1);
    }
}
