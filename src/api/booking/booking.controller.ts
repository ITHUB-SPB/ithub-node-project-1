import type { Request, Response } from 'express';
import * as v from 'valibot';

import BookingService from './booking.service.js'
import * as schema from './booking.schema.js';

export default class BookingController {
    static async find(_request: Request, response: Response) {
        try {
            const bookings = await BookingService.findAll()

            response.statusCode = 200
            return response.json({
                bookings: bookings,
            })
        } catch (error) {
            console.error(error);
            response.statusCode = 500
            return response.json({
                error: error instanceof Error ? error.message : 'Internal server error',
            })
        }
    }

    static async create(request: Request, response: Response) {
        try {
            const payloadObject = v.parse(
                schema.newBookingInSchema,
                request.body,
            );

            const createdBooking = await BookingService.create(payloadObject)

            response.statusCode = 201
            return response.json({
                booking: createdBooking,
            })
        } catch (error) {
            console.error(error);
            response.statusCode = 400
            return response.json({
                error: error instanceof Error ? error.message : 'Bad request',
            })
        }
    }

    static async delete(request: Request, response: Response) {
        try {
            const idParam = request.params['id']
            const idStr = typeof idParam === 'string' ? idParam : undefined
            const id = idStr ? parseInt(idStr) : NaN
            if (isNaN(id)) {
                response.statusCode = 400
                return response.json({
                    error: 'Invalid id format',
                })
            }
            
            await BookingService.delete(id)
            
            response.statusCode = 204
            return response.send()
        } catch (error) {
            console.error(error);
            response.statusCode = 400
            return response.json({
                error: error instanceof Error ? error.message : 'Bad request',
            })
        }
    }
}
