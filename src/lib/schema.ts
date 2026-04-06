import * as v from 'valibot';

export const resourceSchema = v.picklist(
    ['/areas', '/bookings'],
    'Неизвестный ресурс',
);

export const methodSchema = v.picklist(
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    'Неподдерживаемый метод',
);

export const pathParamsSchema = v.nullable(
    v.object({
        id: v.union([
            v.pipe(v.number(), v.integer()),
            v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
        ]),
    }),
);

const paginationSchema = v.object({
    limit: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
    ),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const filterSchema = v.object({
    filter: v.optional(v.string()),
});

const sortingSchema = v.object({
    sort: v.optional(v.string()),
});

export const queryParamsSchema = v.object({
    ...paginationSchema.entries,
    ...filterSchema.entries,
    ...sortingSchema.entries,
});

export const paramsSchema = v.object({
    pathParams: pathParamsSchema,
    queryParams: queryParamsSchema,
});

export const parserOutputSchema = v.object({
    resource: resourceSchema,
    method: methodSchema,
    params: paramsSchema,
    payload: v.nullable(v.looseObject({})),
});

export type Resource = v.InferOutput<typeof resourceSchema>;

export type Method = v.InferOutput<typeof methodSchema>;

export type Params = v.InferOutput<typeof paramsSchema>;

export type ParserOutput = Promise<v.InferOutput<typeof parserOutputSchema>>;
