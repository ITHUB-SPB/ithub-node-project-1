import * as v from 'valibot'

export const bookingsPaginationSchema = v.optional(
    v.object({
        limit: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
        offset: v.pipe(v.number(), v.integer(), v.minValue(0)),
    }),
)

export const newBookingInSchema = v.object({
    start: v.pipe(v.number(), v.integer()),
    end: v.pipe(v.number(), v.integer()),
})

export const newBookingOutSchema = v.object({
    statusCode: v.picklist([201, 400]),
    data: v.object({
        booking: v.object({
            start: v.pipe(v.number(), v.integer()),
            end: v.pipe(v.number(), v.integer()),
            createdAt: v.pipe(v.number(), v.integer()),
        }),
    }),
})
