import * as v from 'valibot';

import { Timeslot } from '../timeslot/timeslot.model.js';
import BookingService from './booking.service.js'
import * as schema from './booking.schema.js';
import type { Params } from '../lib/schema.js';


export default class BookingController {
    static findAll({ params }: { params: Params, payload: any }): schema.BookingsResponseSchema {
        const bookings = BookingService.findAll();

        return {
            statusCode: 200,
            data: {
                bookings: bookings, 
                totalItems: bookings.length
            },
        };
    }

    static create({ payload }: { params: Params, payload: any }) {
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
        } catch (error: any) {
            return {
                statusCode: 400,
                data: { error: error.message || 'ошибка валидации' },
            };
        }
    }


    static delete({ params }: { params: any, payload: any }) {
        try {
            const validated = v.parse(schema.bookingDeleteSchema, { params });
            const id = validated.params.pathParams.id;
            
            BookingService.delete(id);
            
            return {
                statusCode: 204,
                data: { message: `Record with id ${id} successfully removed` },
            };
        } catch (error: any) {
            return {
                statusCode: 400,
                data: { error: error.message || 'ошибка при удалении' },
            };
        }
    }
}


