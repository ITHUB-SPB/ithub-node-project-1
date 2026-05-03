import * as v from 'valibot';
import db from '../../database/connection.js';
import { timeslotsSchema, type TimeslotsSchema, type TimeslotsQuerySchema } from './timeslot.schema.js';

export default class TimeslotService {
    static async findAll(): Promise<TimeslotsSchema> {
        const timeslots = await db.selectFrom('timeslots')
            .selectAll()
            .execute();

        return v.parse(timeslotsSchema, timeslots);
    }

    static async findByTimeRange(query: TimeslotsQuerySchema): Promise<TimeslotsSchema> {
        let statement = db.selectFrom('timeslots').selectAll();

        if (query.time_from) {
            statement = statement.where('start', '>=', query.time_from);
        }
        if (query.time_to) {
            statement = statement.where('end', '<=', query.time_to);
        }

        const timeslots = await statement.execute();
        return v.parse(timeslotsSchema, timeslots);
    }
}