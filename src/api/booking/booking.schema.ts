import * as v from "valibot";

const numberFromQuerySchema = v.union([
  v.pipe(v.string(), v.transform(Number), v.number()),
  v.number(),
]);

export const bookingParamsSchema = v.object({
  id: v.pipe(numberFromQuerySchema, v.integer(), v.minValue(1)),
});

export const bookingsQuerySchema = v.object({
  areaId: v.optional(v.pipe(numberFromQuerySchema, v.integer(), v.minValue(1))),
  timeslotId: v.optional(
    v.pipe(numberFromQuerySchema, v.integer(), v.minValue(1)),
  ),
  limit: v.optional(v.pipe(numberFromQuerySchema, v.integer(), v.minValue(1))),
  offset: v.optional(v.pipe(numberFromQuerySchema, v.integer(), v.minValue(0))),
});

export const createBookingSchema = v.object({
  areaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  userId: v.nullable(v.number()),
});

export const bookingSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  areaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  userId: v.nullable(v.number()),
  createdAt: v.string(),
});

export const bookingsSchema = v.array(bookingSchema);

export const bookingsResponseSchema = v.object({
  bookings: bookingsSchema,
  totalItems: v.number(),
});

export const bookingResponseSchema = v.object({
  booking: bookingSchema,
});

export type BookingParamsSchema = v.InferOutput<typeof bookingParamsSchema>;
export type BookingsQuerySchema = v.InferOutput<typeof bookingsQuerySchema>;
export type CreateBookingSchema = v.InferOutput<typeof createBookingSchema>;
export type BookingSchema = v.InferOutput<typeof bookingSchema>;
export type BookingsSchema = v.InferOutput<typeof bookingsSchema>;
export type BookingsResponseSchema = v.InferOutput<
  typeof bookingsResponseSchema
>;
export type BookingResponseSchema = v.InferOutput<typeof bookingResponseSchema>;
