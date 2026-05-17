import * as v from 'valibot';

const paginationSchema = v.object({
  limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50))),
  offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const filterSchema = v.object({
  filter: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) =>
        value.split(",").map(Number).filter(n => Number.isInteger(n) && n > 0)
      )
    )
  ),
});

export const areasQuerySchema = v.object({
  ...paginationSchema.entries,
  ...filterSchema.entries,
  capacity: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.minValue(1))),
  amenities: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) => value.split(","))
    )
  ),
});