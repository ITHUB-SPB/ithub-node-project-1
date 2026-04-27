import * as v from 'valibot';

const timeslotSchema = v.object({});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({}), // TODO
});

// TODO
export type TimeslotsSchema = unknown;
export type TimeslotsResponseSchema = unknown;
