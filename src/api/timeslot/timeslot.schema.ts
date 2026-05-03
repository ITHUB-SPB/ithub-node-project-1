import * as v from 'valibot';

export const timeslotSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    start: v.pipe(v.string(), v.nonEmpty()),
    end: v.pipe(v.string(), v.nonEmpty()),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsQuerySchema = v.object({
    time_from: v.optional(v.pipe(v.string(), v.nonEmpty())),
    time_to: v.optional(v.pipe(v.string(), v.nonEmpty())),
});


export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({
        timeslots: timeslotsSchema,
    }),
});

export type TimeslotSchema = v.InferOutput<typeof timeslotSchema>;
export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsQuerySchema = v.InferOutput<typeof timeslotsQuerySchema>;
export type TimeslotsResponseSchema = v.InferOutput<typeof timeslotsResponseSchema>;