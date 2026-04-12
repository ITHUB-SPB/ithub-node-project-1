import * as v from 'valibot';

import { Timeslot } from '../timeslot/timeslot.model.js';
import BookingService from './booking.service.js'
import * as schema from './booking.schema.js';

export default class BookingController {
    static find() {
        const bookings = BookingService.findAll();

        return {
            statusCode: 200,
            data: {
                bookings,
            },
        };
    }

    static create(payload: unknown) {
        try {
            const payloadObject = v.parse(schema.newBookingInSchema, payload);

            const slotObject = Timeslot.fromMapped(payloadObject);

            const createdBooking = BookingService.create({
                ...slotObject.toMapped(),
                createdAt: Math.floor(Date.now() / 1000),
            });

            return v.parse(schema.newBookingOutSchema, {
                statusCode: 201,
                data: {
                    booking: createdBooking,
                },
            });
        } catch (error) {
            console.error(error);
            return {
                statusCode: 400,
                data: {
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }

    static delete(options: unknown) {
        try {
            const { params } = v.parse(schema.bookingDeleteSchema, options);
            const idToDelete = params.pathParams.id;

            BookingService.delete(idToDelete);

            return {
                statusCode: 204,
                data: {
                    message: `Record with id ${idToDelete} successfully removed`,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 400,
                data: {
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }
}
