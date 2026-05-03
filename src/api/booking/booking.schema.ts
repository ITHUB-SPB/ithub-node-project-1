import * as v from 'valibot';

export const newBookingInSchema = v.object({
    start: v.pipe(v.number(), v.integer()),
    end: v.pipe(v.number(), v.integer()),
});

export const newBookingOutSchema = v.union([
    v.object({
        statusCode: v.literal(201),
        data: v.object({
            booking: v.object({
                id: v.pipe(v.number(), v.integer(), v.minValue(1)),
                start: v.pipe(v.number(), v.integer()),
                end: v.pipe(v.number(), v.integer()),
                createdAt: v.pipe(v.number(), v.integer()),
            }),
        }),
    }),
    v.object({
        statusCode: v.literal(400),
        data: v.object({
            error: v.string(),
        }),
    }),
]);

export const bookingsQuerySchema = v.object({
    limit: v.optional(
        v.pipe(
            v.union([
                v.pipe(v.string(), v.transform(Number), v.number()),
                v.number(),
            ]),
            v.integer(),
            v.minValue(1),
            v.maxValue(50),
        ),
    ),
    offset: v.optional(
        v.pipe(
            v.union([
                v.pipe(v.string(), v.transform(Number), v.number()),
                v.number(),
            ]),
            v.integer(),
            v.minValue(0),
        ),
    ),
    timeslotId: v.optional(
        v.pipe(
            v.union([
                v.pipe(v.string(), v.transform(Number), v.number()),
                v.number(),
            ]),
            v.integer(),
            v.minValue(1),
        ),
    ),
});

export const bookingSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
    userId: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
    createdAt: v.string(),
});

export const bookingsSchema = v.array(bookingSchema);

export const bookingsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({
        bookings: bookingsSchema,
        totalItems: v.number(),
    }),
});

export type NewBookingInSchema = v.InferOutput<typeof newBookingInSchema>;
export type NewBookingOutSchema = v.InferOutput<typeof newBookingOutSchema>;
export type BookingsQuerySchema = v.InferOutput<typeof bookingsQuerySchema>;
export type BookingSchema = v.InferOutput<typeof bookingSchema>;
export type BookingsSchema = v.InferOutput<typeof bookingsSchema>;