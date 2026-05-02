import * as v from 'valibot';

const timeslotSchema = v.object({
    id: v.pipe(v.number(), v.integer()),
    start: v.string(),
    end: v.string(),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({
        timeslots: timeslotsSchema,
    }),
});

export type TimeslotSchema = v.InferOutput<typeof timeslotSchema>;
export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<typeof timeslotsResponseSchema>;
