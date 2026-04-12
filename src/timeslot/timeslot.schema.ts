import * as v from 'valibot';

const timeslotSchema = v.object({
    id: v.number(),
    start: v.number(),
    end: v.number(),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({}), // TODO
});

// TODO
export type TimeslotRoutes = v.InferOutput<typeof timeslotSchema>;
export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<
    typeof timeslotsResponseSchema
>;
