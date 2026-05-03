import { type Generated } from 'kysely';

export interface AreaTable {
    id: Generated<number>;
    title: string;
}

export interface TimeslotTable {
    id: Generated<number>;
    start: string;
    end: string;
}

export interface UserTable {
    id: Generated<number>;
    username: string;
    createdAt: string;
}

export interface BookingTable {
    id: Generated<number>;
    areaId: number;
    timeslotId: number;
    userId: number | null;
    createdAt: string;
}

export interface Database {
    areas: AreaTable;
    timeslots: TimeslotTable;
    users: UserTable;
    bookings: BookingTable;
}
