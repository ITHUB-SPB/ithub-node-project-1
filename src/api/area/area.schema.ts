import * as v from "valibot";

const paginationSchema = v.object({
  limit: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(1),
      v.maxValue(100)
    )
  ),
  offset: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(0)
    )
  ),
});

const searchSchema = v.object({
  search: v.optional(v.string()),
});

export const areasQuerySchema = v.object({
  ...paginationSchema.entries,
  ...searchSchema.entries,
});

export const areaItemSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const areasListSchema = v.array(areaItemSchema);

export type AreaItem = v.InferOutput<typeof areaItemSchema>;
export type AreasQuery = v.InferOutput<typeof areasQuerySchema>;