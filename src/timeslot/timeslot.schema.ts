import * as v from 'valibot';

const timeslotSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    start: v.pipe(v.string(), v.minLength(1)),
    end: v.pipe(v.string(), v.minLength(1)),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.strictObject({
        timeslots: timeslotsSchema,
        totalItems: v.pipe(v.number(), v.integer(), v.minValue(0)),
    }),
});

export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<
    typeof timeslotsResponseSchema
>;
