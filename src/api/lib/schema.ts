import * as v from "valibot";

export const validResources = v.picklist(
  ["/areas", "/bookings", "/timeslots"],
  "Недопустимый ресурс"
);

export const httpMethods = v.picklist(
  ["GET", "POST", "PUT", "PATCH", "DELETE"],
  "Неподдерживаемый HTTP метод"
);

export const routeParams = v.nullable(
  v.object({
    id: v.union([
      v.pipe(v.number(), v.integer()),
      v.pipe(v.string(), v.transform(Number), v.number(), v.integer()),
    ]),
  })
);

const paginationShape = v.object({
  limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50))),
  offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const filterShape = v.object({
  filter: v.optional(v.string()),
  search: v.optional(v.string()),
});

const sortShape = v.object({
  sortBy: v.optional(v.string()),
  order: v.optional(v.picklist(["asc", "desc"])),
});

export const queryParamsShape = v.object({
  ...paginationShape.entries,
  ...filterShape.entries,
  ...sortShape.entries,
});

export const parsedRequestSchema = v.object({
  resource: validResources,
  method: httpMethods,
  params: v.object({
    path: routeParams,
    query: queryParamsShape,
  }),
  body: v.nullable(v.looseObject({})),
});

export type HttpMethod = v.InferOutput<typeof httpMethods>;
export type ValidResource = v.InferOutput<typeof validResources>;
export type ParsedRequest = v.InferOutput<typeof parsedRequestSchema>;