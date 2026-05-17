import type { Generated } from "kysely";
import * as v from "valibot";

const numberSchema = v.pipe(
  v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
  v.integer(),
  v.minValue(1)
);

const paginationSchema = v.object({
  limit: v.optional(v.pipe(numberSchema, v.maxValue(50))),
  offset: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(0)
    )
  ),
});

const idsSchema = v.pipe(
  v.union([v.string(), v.array(v.string())]),
  v.transform((value) => {
    const values = Array.isArray(value) ? value : value.split(",");

    return values
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);
  })
);

const boolSchema = v.pipe(
  v.union([v.boolean(), v.number(), v.string()]),
  v.transform((value) => {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value === 1;
    }

    return ["1", "true", "on", "yes"].includes(value.toLowerCase());
  })
);

export const areasQuerySchema = v.object({
  ...paginationSchema.entries,
  filter: v.optional(idsSchema),
  area: v.optional(idsSchema),
  capacity: v.optional(numberSchema),
  plasma: v.optional(boolSchema),
  board: v.optional(boolSchema),
  wifi: v.optional(boolSchema),
});

const areaSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.pipe(v.string(), v.nonEmpty()),
  capacity: v.pipe(v.number(), v.integer(), v.minValue(1)),
  hasPlasma: v.picklist([0, 1]),
  hasBoard: v.picklist([0, 1]),
  hasWifi: v.picklist([0, 1]),
});

export const areasSchema = v.array(areaSchema);

export const areaDetailSchema = v.strictObject({
  ...areaSchema.entries,
  bookings: v.array(
    v.object({
      id: v.pipe(v.number(), v.integer(), v.minValue(1)),
      areaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
      start: v.pipe(v.number(), v.integer()),
      end: v.pipe(v.number(), v.integer()),
      createdAt: v.pipe(v.number(), v.integer()),
    })
  ),
});

export const areasResponseSchema = v.strictObject({
  statusCode: v.literal(200),
  data: v.object({
    areas: areasSchema,
    totalItems: v.number(),
  }),
});

export type AreaSchema = v.InferOutput<typeof areaSchema> & {
  id: Generated<number>;
};
export type AreasQuerySchema = v.InferOutput<typeof areasQuerySchema>;
export type AreasSchema = v.InferOutput<typeof areasSchema>;
export type AreaDetailSchema = v.InferOutput<typeof areaDetailSchema>;
export type AreasResponseSchema = v.InferOutput<typeof areasResponseSchema>;
