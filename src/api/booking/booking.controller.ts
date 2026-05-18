import { type Request, type Response } from 'express';
import * as v from 'valibot';
import BookingService from './booking.service.js';
import * as schema from './booking.schema.js';

export default class BookingController {
    static async find(request: Request, response: Response): Promise<Response> {
        const bookings = await BookingService.findAll();
        return response.status(200).json({ bookings });
    }

    static async create(request: Request, response: Response): Promise<Response> {
        try {
            const payload = v.parse(schema.newBookingInSchema, request.body);
            const createdBooking = await BookingService.create(payload);
            return response.status(201).json({ booking: createdBooking });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return response.status(400).json({ error: message });
        }
    }

    static async delete(request: Request, response: Response): Promise<Response> {
        try {
            const id = Number(request.params['id']);
            await BookingService.delete(id);
            return response.status(204).json({ message: `Запись с id ${id} была удалена` });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return response.status(400).json({ error: message });
        }
    }
}