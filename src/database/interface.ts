import { Generated } from 'kysely';

export interface AreasTable {
    id: Generated<number>;
    title: string;
}

export interface TimeslotsTable {
    id: Generated<number>;
    start: string;
    end: string;
}

export interface BookingsTable {
    id: Generated<number>;
    timeslotId: number;
    userId: number | null;
    createdAt: Generated<string>;
}

export interface Database {
    areas: AreasTable;
    timeslots: TimeslotsTable;
    bookings: BookingsTable;
}