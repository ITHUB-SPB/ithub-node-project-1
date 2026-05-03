import * as v from "valibot";

export const createBookingSchema = v.object({
  areaId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  start: v.pipe(v.number(), v.integer()),
  end: v.pipe(v.number(), v.integer()),
});

export const bookingSchema = v.object({
  ...createBookingSchema.entries,
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  createdAt: v.pipe(v.number(), v.integer()),
});

export const newBookingInSchema = v.object({
  start: v.pipe(v.number(), v.integer()),
  end: v.pipe(v.number(), v.integer()),
});

export const bookingsResponseSchema = v.strictObject({
  statusCode: v.literal(200),
  data: v.object({
    bookings: v.array(bookingSchema),
    totalItems: v.pipe(v.number(), v.integer(), v.minValue(0)),
  }),
});

export const newBookingOutSchema = v.union([
  v.object({
    statusCode: v.literal(201),
    data: v.object({
      booking: v.object({
        start: v.pipe(v.number(), v.integer()),
        end: v.pipe(v.number(), v.integer()),
        createdAt: v.pipe(v.number(), v.integer()),
      }),
    }),
  }),
  v.object({
    statusCode: v.literal(400),
    data: v.object({}), // TODO
  }),
]);

export const bookingDeleteSchema = v.object({
  params: v.strictObject({
    pathParams: v.strictObject(
      {
        id: v.pipe(
          v.number("Invalid id format: id must be numeric"),
          v.integer("Invalid id format: id must be integer"),
          v.minValue(1, "Invalid id format: id must be positive"),
        ),
      },
      "Id for record to delete must be set",
    ),
  }),
});

export type Booking = v.InferOutput<typeof bookingSchema>;
export type BookingsResponseSchema = v.InferOutput<
  typeof bookingsResponseSchema
>;
