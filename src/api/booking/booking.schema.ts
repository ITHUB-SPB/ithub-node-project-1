import * as v from "valibot";

export const createBookingSchema = v.object({
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  userId: v.optional(v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1)))),
});

export const bookingFiltersSchema = v.object({
  limit: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(1),
      v.maxValue(50)
    )
  ),
  offset: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(0)
    )
  ),
  timeslotId: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(1)
    )
  ),
  areaId: v.optional(
    v.pipe(
      v.union([v.pipe(v.string(), v.transform(Number), v.number()), v.number()]),
      v.integer(),
      v.minValue(1)
    )
  ),
});

export const bookingRecordSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  userId: v.nullable(v.pipe(v.number(), v.integer(), v.minValue(1))),
  createdAt: v.string(),
});

export const bookingListSchema = v.array(bookingRecordSchema);

export type CreateBooking = v.InferOutput<typeof createBookingSchema>;
export type BookingFilters = v.InferOutput<typeof bookingFiltersSchema>;
export type BookingRecord = v.InferOutput<typeof bookingRecordSchema>;