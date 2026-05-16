import type { Generated } from "kysely";
import * as v from "valibot";

export const newBookingInSchema = v.object({
    timeslotId: v.pipe(
        v.transform((value) => Number(value)),
        v.number(),
        v.integer(),
        v.minValue(1),
    ),
});

export const newBookingOutSchema = v.union([
    v.object({
        statusCode: v.literal(201),
        data: v.object({
            booking: v.object({
                start: v.pipe(v.number(), v.integer()),
                end: v.pipe(v.number(), v.integer()),
                createdAt: v.pipe(v.number(), v.integer()),
            }),
        }),
    }),
    v.object({
        statusCode: v.literal(400),
        data: v.object({}), // TODO
    }),
]);

export const bookingDeleteSchema = v.object({
    params: v.strictObject({
        pathParams: v.strictObject(
            {
                id: v.pipe(
                    v.number("Invalid id format: id must be numeric"),
                    v.integer("Invalid id format: id must be integer"),
                    v.minValue(1, "Invalid id format: id must be positive"),
                ),
            },
            "Id for record to delete must be set",
        ),
    }),
});

export const bookingSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    start: v.pipe(v.number(), v.integer()),
    end: v.pipe(v.number(), v.integer()),
    createdAt: v.pipe(v.number(), v.integer()),
});

export type BookingSchema = v.InferOutput<typeof bookingSchema> & {
    id: Generated<"id">;
};
