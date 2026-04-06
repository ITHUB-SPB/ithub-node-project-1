import * as v from 'valibot';

import { Timeslot } from '../timeslot/timeslot.model.js';
import BookingService from './booking.service.js'
import * as schema from './booking.schema.js';

export default class BookingController {
    static find() {
        const bookings = BookingService.findAll()

        return {
            statusCode: 200,
            data: {
                bookings: bookings.map((bookingObject) =>
                    bookingObject.toString(),
                ),
            },
        };
    }

    static create(payload) {
        try {
            const payloadObject = v.parse(
                schema.newBookingInSchema,
                JSON.parse(payload),
            );

            const slotObject = Timeslot.fromMapped(payloadObject);

            const createdBooking = BookingService.create({
                    ...slotObject.toMapped(),
                    createdAt: Math.floor(Date.now() / 1000),
            })

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
                    error: error.message || '',
                },
            };
        }
    }

    static delete(options) {
        try {
            const { params } = v.parse(schema.bookingDeleteSchema, options);
            
            BookingService.delete(params.pathParams.id)
            
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
                    error: error.message || '',
                },
            };
        }
    }
}
