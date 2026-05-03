import { type Request, type Response } from 'express';
import * as v from 'valibot';
import BookingService from './booking.service.js';
import * as schema from './booking.schema.js';

export default class BookingController {
    static async findAll(request: Request, response: Response) {
        const queryParams = v.parse(
            schema.bookingsQuerySchema,
            request.query,
        );

        const bookings = await BookingService.findAll(queryParams);

        return response.status(200).json({
            bookings,
            totalItems: bookings.length,
        });
    }

    static async findOne(request: Request, response: Response) {
        const params = v.parse(schema.bookingParamsSchema, request.params);
        const booking = await BookingService.findOne(params.id);

        if (!booking) {
            return response.status(404).json({
                message: 'Booking not found',
            });
        }

        return response.status(200).json({
            booking,
        });
    }

    static async create(request: Request, response: Response) {
        const payload = v.parse(schema.createBookingSchema, request.body);
        const booking = await BookingService.create(payload);

        return response.status(201).json({
            booking,
        });
    }

    static async delete(request: Request, response: Response) {
        const params = v.parse(schema.bookingParamsSchema, request.params);
        const isDeleted = await BookingService.delete(params.id);

        if (!isDeleted) {
            return response.status(404).json({
                message: 'Booking not found',
            });
        }

        return response.status(204).send();
    }
}