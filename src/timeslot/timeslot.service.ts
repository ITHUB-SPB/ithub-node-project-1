import * as v from 'valibot';

import { Timeslot } from './timeslot.model.js';
import * as schema from './timeslot.schema.js';
import connection from '../database/connection.js'

function parseTime(value: string) {
    const [hours = 0, minutes = 0] = value.split(':').map(Number);
    return new Date(1970, 0, 1, hours, minutes, 0, 0);
}

export default class TimeslotService {
    static findAll(filter?: string) {
        const statement = connection.prepare(
            'select * from timeslots order by start',
        );

        const rows = statement.all() as Array<{
            id: number;
            start: string;
            end: string;
        }>;

        const items = rows.map((row) => ({
            row,
            model: new Timeslot(parseTime(row.start), parseTime(row.end)),
        }));

        const filterValue = filter?.trim().toUpperCase();
        const filtered = filterValue === 'AM'
            ? items.filter((item) => item.model.AM)
            : filterValue === 'PM'
            ? items.filter((item) => item.model.PM)
            : items;

        return v.parse(
            schema.timeslotsSchema,
            filtered.map(({ row }) => ({
                id: row.id,
                start: row.start,
                end: row.end,
            })),
        );
    }
}
