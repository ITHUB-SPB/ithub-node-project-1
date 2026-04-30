import { type Request, type Response } from 'express';
import BookingService from './booking.service.js';

export default class BookingController {
    static async findAll(_request: Request, response: Response) {
        const bookings = await BookingService.findAll();

        return response.status(200).json({
            bookings,
            totalItems: bookings.length,
        });
    }
}
