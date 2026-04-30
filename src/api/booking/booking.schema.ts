import * as v from 'valibot';

export const bookingSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  userId: v.nullable(v.number()),
  createdAt: v.string(),
});

export const bookingsSchema = v.array(bookingSchema);

export const bookingsResponseSchema = v.object({
  bookings: bookingsSchema,
  totalItems: v.number(),
});

export type BookingSchema = v.InferOutput<typeof bookingSchema>;
export type BookingsSchema = v.InferOutput<typeof bookingsSchema>;
export type BookingsResponseSchema = v.InferOutput<typeof bookingsResponseSchema>;
