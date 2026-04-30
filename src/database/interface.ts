import { type AreaSchema } from '../api/area/area.schema.js';
import { type TimeslotSchema } from '../api/timeslot/timeslot.schema.js';

export interface UserTable {
  id: number;
  username: string;
  createdAt: string;
}

export interface BookingTable {
  id: number;
  timeslotId: number;
  userId: number | null;
  createdAt: string;
}

export interface Database {
  areas: AreaSchema;
  timeslots: TimeslotSchema;
  users: UserTable;
  bookings: BookingTable;
}