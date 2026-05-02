import { type AreaSchema } from "../api/area/area.schema.js"

export interface TimeslotSchema {
    id: number;
    start: string;
    end: string;
}

export interface BookingSchema {
    id: number;
    timeslotId: number;
    userId?: number | null;
    createdAt: string;
}

export interface UserSchema {
    id: number;
    username: string;
    createdAt: string;
}

export interface Database {
    areas: AreaSchema;
    timeslots: TimeslotSchema;
    bookings: BookingSchema;
    users: UserSchema;
}