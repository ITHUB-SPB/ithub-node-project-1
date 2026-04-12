import * as v from 'valibot';

const timeslotSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    start: v.pipe(v.number(), v.integer(), v.minValue(0)),
    end: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({
        timeslots: timeslotsSchema,
    }),
});

export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<
    typeof timeslotsResponseSchema
>;
