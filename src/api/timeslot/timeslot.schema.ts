import type { Generated } from "kysely";
import * as v from "valibot";

export const timeslotSchema = v.object({
  id: v.number(),
  start: v.string(),
  end: v.string(),
});

export const timeslotsSchema = v.array(timeslotSchema);

export const timeslotsQuerySchema = v.object({
  period: v.optional(v.picklist(["AM", "PM"])),
});

export type TimeslotSchema = v.InferOutput<typeof timeslotSchema> & {
  id: Generated<"id">;
};
export type TimeslotsSchema = v.InferOutput<typeof timeslotsSchema>;
export type TimeslotsQuerySchema = v.InferOutput<typeof timeslotsQuerySchema>;
