import { type Request, type Response } from 'express';
import * as v from 'valibot';
import BookingService from './booking.service.js';
import * as schema from './booking.schema.js';

export default class BookingController {
    static find = async (request: Request, response: Response): Promise<void> => {
        try {
            const query = v.parse(schema.bookingsQuerySchema, request.query);
            
            let result;
            if (query.limit || query.timeslotId) {
                result = await BookingService.findByFilters(query);
            } else {
                const bookings = await BookingService.findAll();
                result = { data: bookings, totalItems: bookings.length };
            }

            response.status(200).json({
                bookings: result.data,
                totalItems: result.totalItems,
            });
        } catch (error: any) {
            console.error(error);
            response.status(400).json({ error: error.message || 'Bad request' });
        }
    };

    static create = async (request: Request, response: Response): Promise<void> => {
        try {
            const payloadObject = v.parse(schema.newBookingInSchema, request.body);
            const createdBooking = await BookingService.create(payloadObject);

            response.status(201).json({ booking: createdBooking });
        } catch (error: any) {
            console.error(error);
            response.status(400).json({ error: error.message || 'Validation failed' });
        }
    };

    static delete = async (request: Request, response: Response): Promise<void> => {
        try {
            const id = v.parse(
                v.pipe(
                    v.number('Invalid id'),
                    v.integer('Must be integer'),
                    v.minValue(1, 'Must be positive'),
                ),
                Number(request.params.id),
            );

            await BookingService.delete(id);
            response.status(204).send();
        } catch (error: any) {
            console.error(error);
            
            if (error.message?.includes('not found')) {
                response.status(404).json({ error: error.message });
            } else {
                response.status(400).json({ error: error.message || 'Bad request' });
            }
        }
    };
}
