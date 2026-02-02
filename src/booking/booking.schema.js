import * as v from 'valibot';

export const newBookingInSchema = v.object({
    start: v.pipe(v.number(), v.integer()),
    end: v.pipe(v.number(), v.integer()),
});

export const newBookingOutSchema = v.object({
    statusCode: v.picklist([201, 400]),
    data: v.object({
        booking: v.object({
            start: v.pipe(v.number(), v.integer()),
            end: v.pipe(v.number(), v.integer()),
            createdAt: v.pipe(v.number(), v.integer()),
        }),
    }),
});

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
