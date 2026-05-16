import type { Generated } from "kysely";
import * as v from "valibot";

const paginationSchema = v.object({
  limit: v.optional(
    v.pipe(
      v.union([
        v.pipe(v.string(), v.transform(Number), v.number()),
        v.number(),
      ]),
      v.integer(),
      v.minValue(1),
      v.maxValue(50)
    )
  ),
  offset: v.optional(
    v.pipe(
      v.union([
        v.pipe(v.string(), v.transform(Number), v.number()),
        v.number(),
      ]),
      v.integer(),
      v.minValue(1)
    )
  ),
});

const filterSchema = v.object({
  filter: v.optional(
    v.pipe(
      v.string(),
      v.transform((value) =>
        value
          .split(",")
          .map((v) => Number(v))
          .filter((n) => Number.isInteger(n) && n > 0)
      )
    )
  ),
});

export const areasQuerySchema = v.object({
  ...paginationSchema.entries,
  ...filterSchema.entries,
});

const areaSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const areasSchema = v.array(areaSchema);

export const areasResponseSchema = v.strictObject({
  statusCode: v.literal(200),
  data: v.object({
    areas: areasSchema,
    totalItems: v.number(),
  }),
});

export type AreaSchema = v.InferOutput<typeof areaSchema> & {
  id: Generated<"id">;
};
export type AreasQuerySchema = v.InferOutput<typeof areasQuerySchema>;
export type AreasSchema = v.InferOutput<typeof areasSchema>;
export type AreasResponseSchema = v.InferOutput<typeof areasResponseSchema>;
