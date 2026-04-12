import * as v from 'valibot';

import { Timeslot } from './timeslot.model.js';
import * as schema from './timeslot.schema.js';
import connection from '../database/connection.js';

export default class TimeslotService {
    static findAll(queryParams: any): schema.TimeslotsSchema {
        const statement = connection.prepare(
            'SELECT * FROM timeslots ORDER BY start',
        );
        const records = statement.all() as {
            id: number;
            start: number;
            end: number;
        }[];

        let timeslots = records.map((record) => Timeslot.fromMapped(record));

        if (queryParams.filter === 'AM') {
            timeslots = timeslots.filter((slot) => slot.AM);
        } else if (queryParams.filter === 'PM') {
            timeslots = timeslots.filter((slot) => slot.PM);
        }

        const result = timeslots.map((slot) => slot.toMapped());
        return v.parse(schema.timeslotsSchema, result);
    }
}
