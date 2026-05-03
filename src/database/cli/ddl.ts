import { sql } from 'kysely';
import connection from '../connection.js';

export async function createTables() {
    await sql`
        create table if not exists users (
            id integer primary key autoincrement,
            username text not null,
            createdAt text not null
        )
    `.execute(connection);

    await sql`
        create table if not exists areas (
            id integer primary key autoincrement,
            title text not null
        )
    `.execute(connection);

    await sql`
        create table if not exists timeslots (
            id integer primary key autoincrement,
            start text not null,
            end text not null
        )
    `.execute(connection);

    await sql`
        create table if not exists bookings (
            id integer primary key autoincrement,
            areaId integer not null,
            timeslotId integer not null,
            userId integer,
            createdAt text not null
        )
    `.execute(connection);
}

export async function resetTables() {
    await sql`delete from bookings`.execute(connection);
    await sql`delete from users`.execute(connection);
    await sql`delete from areas`.execute(connection);
    await sql`delete from timeslots`.execute(connection);
}