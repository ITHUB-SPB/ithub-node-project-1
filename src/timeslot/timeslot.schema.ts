import * as v from 'valibot';

const timeslotSchema = v.object({});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.union([
    v.object({
        statusCode: v.literal(200),
        data: v.object({}),
    }),
    v.object({
        statusCode: v.literal(400),
        data: v.object({}),
    }),
]);

export type TimeslotsSchema = unknown;
export type TimeslotsResponseSchema = unknown;
