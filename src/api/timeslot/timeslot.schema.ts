import * as v from 'valibot';

const timeslotSchema = v.object({
    id: v.number(),
    start: v.string(),
    end: v.string(),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({}),
});

export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = unknown;
