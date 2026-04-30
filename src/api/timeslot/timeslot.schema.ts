import * as v from "valibot";

export const timeslotsQuerySchema = v.object({
  part: v.optional(v.picklist(["AM", "PM"])),
});

export const timeslotSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  start: v.string(),
  end: v.string(),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsResponseSchema = v.object({
  timeslots: timeslotsSchema,
  totalItems: v.number(),
});

export type TimeslotSchema = v.InferOutput<typeof timeslotSchema>;
export type TimeslotsQuerySchema = v.InferOutput<typeof timeslotsQuerySchema>;
export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsResponseSchema = v.InferOutput<
  typeof timeslotsResponseSchema
>;
