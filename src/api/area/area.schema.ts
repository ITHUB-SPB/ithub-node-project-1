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
            v.maxValue(50),
        ),
    ),
    offset: v.optional(
        v.pipe(
            v.union([
                v.pipe(v.string(), v.transform(Number), v.number()),
                v.number(),
            ]),
            v.integer(),
            v.minValue(1),
        ),
    ),
});

const filterSchema = v.object({
    filter: v.optional(
        v.union([
            v.pipe(
                v.string(),
                v.transform((value) => [Number(value)]),
            ),
            v.pipe(
                v.array(v.string()),
                v.transform((values) =>
                    values
                        .map(Number)
                        .filter((n) => Number.isInteger(n) && n > 0),
                ),
            ),
        ]),
    ),

    capacity: v.optional(
        v.pipe(
            v.union([v.string(), v.number()]),
            v.transform((value) => {
                if (value === "" || value === null) {
                    return 1;
                }

                return Number.isFinite(Number(value)) ? Number(value) : 1;
            }),
            v.number(),
            v.minValue(1),
        ),
    ),
});

const amenitiesSchema = v.object({
    wifi: v.optional(v.literal("1")),
    board: v.optional(v.literal("1")),
    plasma: v.optional(v.literal("1")),
});

export const areasQuerySchema = v.object({
    ...paginationSchema.entries,
    ...filterSchema.entries,
    ...amenitiesSchema.entries,
});

export const areaSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    title: v.pipe(v.string(), v.nonEmpty()),
    capacity: v.number(),
    wifi: v.number(),
    board: v.number(),
    plasma: v.number(),
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
