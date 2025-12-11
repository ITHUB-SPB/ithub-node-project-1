import * as v from 'valibot'

import Timeslot from './timeslot.js'
import { bookings } from './data-provider.js'
import { newBookingInSchema, newBookingOutSchema } from './schema.js'

export class BookingController {
    static findAll() {
        const bookingObjects = bookings.map((bookingMap) =>
            Timeslot.fromMapped(bookingMap),
        )
        console.log(bookingObjects)

        return {
            statusCode: 200,
            data: {
                bookings: bookingObjects.map((bookingObject) =>
                    bookingObject.toString(),
                ),
            },
        }
    }

    static create(payload) {
        try {
            const payloadObject = v.parse(
                newBookingInSchema,
                JSON.parse(payload),
            )

            const slotObject = Timeslot.fromMapped(payloadObject)

            bookings.push({
                ...slotObject.toMapped(),
                createdAt: Math.floor(Date.now() / 1000),
            })

            return v.parse(newBookingOutSchema, {
                statusCode: 201,
                data: {
                    booking: bookings.at(-1),
                },
            })
        } catch (error) {
            console.error(error)
            return {
                statusCode: 400,
                data: {
                    error: error.message || '',
                },
            }
        }
    }
}
