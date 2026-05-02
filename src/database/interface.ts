import { type AreaSchema } from "../api/area/area.schema.js"
import { type BookingSchema } from "../api/booking/booking.schema.js"
import { type TimeslotsSchema } from "../api/timeslot/timeslot.schema.js"

export interface Database {
    areas: AreaSchema
    bookings: BookingSchema
    timeslots: TimeslotsSchema
}