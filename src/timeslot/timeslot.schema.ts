import * as v from "valibot";

export const timeslotSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  start: v.pipe(v.string(), v.nonEmpty()), 
  end: v.pipe(v.string(), v.nonEmpty()),   
  areaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  am: v.boolean(),
  pm: v.boolean(),
});


export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.strictObject({
  statusCode: v.literal(200),
  data: v.object({
    timeslots: timeslotsSchema,
    totalItems: v.pipe(v.number(), v.integer(), v.minValue(0)),
  }),
});

export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<
  typeof timeslotsResponseSchema
>;
