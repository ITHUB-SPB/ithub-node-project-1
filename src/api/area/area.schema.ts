import * as v from 'valibot';

const numberFromQuerySchema = v.union([
    v.pipe(v.string(), v.transform(Number), v.number()),
    v.number(),
]);

export const areaParamsSchema = v.object({
    id: v.pipe(numberFromQuerySchema, v.integer(), v.minValue(1)),
});

export const areasQuerySchema = v.object({
    limit: v.optional(
        v.pipe(
            numberFromQuerySchema,
            v.integer(),
            v.minValue(1),
            v.maxValue(50),
        ),
    ),
    offset: v.optional(
        v.pipe(numberFromQuerySchema, v.integer(), v.minValue(0)),
    ),
    filter: v.optional(v.string()),
});

export const areaSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    title: v.pipe(v.string(), v.nonEmpty()),
});

export const areasSchema = v.array(areaSchema);

export const areasResponseSchema = v.object({
    areas: areasSchema,
    totalItems: v.number(),
});

export const areaResponseSchema = v.object({
    area: areaSchema,
});

export type AreaParamsSchema = v.InferOutput<typeof areaParamsSchema>;
export type AreaSchema = v.InferOutput<typeof areaSchema>;
export type AreasQuerySchema = v.InferOutput<typeof areasQuerySchema>;
export type AreasSchema = v.InferOutput<typeof areasSchema>;
export type AreasResponseSchema = v.InferOutput<typeof areasResponseSchema>;
export type AreaResponseSchema = v.InferOutput<typeof areaResponseSchema>;