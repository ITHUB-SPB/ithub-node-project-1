import { type Request, type Response } from 'express';
import * as v from 'valibot';

import { Timeslot } from '../timeslot/timeslot.model.js';
import BookingService from './booking.service.js'
import * as schema from './booking.schema.js';

export default class BookingController {
    static async find(request: Request, response: Response): Promise<Response> {
        const bookings = BookingService.findAll()

        const data = {
            bookings: bookings.map((b: any) => b.toString()),
        }

        return response.status(200).json(data)
    }

    static async create(request: Request, response: Response): Promise<Response> {
        try {
            const payload = v.parse(
                schema.newBookingInSchema,
                request.body
            )

            const slot = Timeslot.fromMapped(payload)

            const createdBooking = BookingService.create({
                ...slot.toMapped(),
                createdAt: Math.floor(Date.now() / 1000)
            })

            return response.status(200).json({
                booking: createdBooking,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)

            return response.status(400).json({
                error: message,
            })
        }
    }

    static async delete(request: Request, response: Response): Promise<Response> {
        try {
            const id = v.parse(
                schema.bookingDeleteSchema,
                {
                    params: {
                        pathParams: {
                            id: Number(request.params['id']),
                        }
                    }
                }
            ).params.pathParams.id

            BookingService.delete(id)

            return response.status(204).json({
                message: `Запись с id ${id} была удалена`
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)

            return response.status(400).json({
                error: message
            })
        }
    }
}