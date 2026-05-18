import * as v from "valibot";

export const timeslotItemSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  start: v.pipe(v.string(), v.nonEmpty()),
  end: v.pipe(v.string(), v.nonEmpty()),
});

export const timeslotListSchema = v.array(timeslotItemSchema);

export const timeslotFiltersSchema = v.object({
  startTime: v.optional(v.pipe(v.string(), v.nonEmpty())),
  endTime: v.optional(v.pipe(v.string(), v.nonEmpty())),
  period: v.optional(v.picklist(["am", "pm"])),
});

export type TimeslotItem = v.InferOutput<typeof timeslotItemSchema>;
export type TimeslotList = v.InferOutput<typeof timeslotListSchema>;
export type TimeslotFilters = v.InferOutput<typeof timeslotFiltersSchema>;