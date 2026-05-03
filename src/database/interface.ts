import type { Generated } from "kysely";

export interface AreasTable {
  id: Generated<number>;
  title: string;
}

export interface TimeslotsTable {
  id: Generated<number>;
  start: number;
  end: number;
}

export interface BookingsTable {
  id: Generated<number>;
  timeslotId: number;
  userId: number | null;
  createdAt: number;
}


export interface Database {
  areas: AreasTable;
  timeslots: TimeslotsTable;
  bookings: BookingsTable;
}
