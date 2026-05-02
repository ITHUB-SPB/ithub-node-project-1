import * as v from 'valibot';

export const newBookingInSchema = v.object({
    timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
    userId: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
});

const bookingSchema = v.object({
    id: v.pipe(v.number(), v.integer()),
    timeslotId: v.pipe(v.number(), v.integer()),
    userId: v.optional(v.union([v.pipe(v.number(), v.integer()), v.null()])),
    createdAt: v.string(),
});

export const bookingsSchema = v.array(bookingSchema);

export const newBookingOutSchema = v.union([
    v.object({
        statusCode: v.literal(201),
        data: v.object({
            booking: bookingSchema,
        }),
    }),
    v.object({
        statusCode: v.literal(400),
        data: v.object({
            error: v.string(),
        }),
    }),
]);

export const bookingDeleteSchema = v.object({
    params: v.strictObject({
        pathParams: v.strictObject(
            {
                id: v.pipe(
                    v.number('Invalid id format: id must be numeric'),
                    v.integer('Invalid id format: id must be integer'),
                    v.minValue(1, 'Invalid id format: id must be positive'),
                ),
            },
            'Id for record to delete must be set',
        ),
    }),
});

