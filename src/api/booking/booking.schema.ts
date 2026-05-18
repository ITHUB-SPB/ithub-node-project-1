import * as v from 'valibot';

export const newBookingInSchema = v.object({
  roomId: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

export const bookingSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer()),
  roomId: v.pipe(v.number(), v.integer()),
  createdAt: v.pipe(v.number(), v.integer()),
});