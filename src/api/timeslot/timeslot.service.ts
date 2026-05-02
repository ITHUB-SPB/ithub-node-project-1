import * as v from 'valibot';

import * as schema from './timeslot.schema.js';
import { db } from '../../database/connection.js'


export default class TimeslotService {
    static async findAll(queryParams: any = {}) {
        let statement = db.selectFrom('timeslots').selectAll().orderBy('timeslots.start')

        if (queryParams.limit) {
            const offset = queryParams.offset || 0
            statement = statement.limit(queryParams.limit).offset(offset)
        }

        // Filter by time of day if provided
        if (queryParams.timeOfDay) {
            // You can add time-based filtering here if needed
            // For example, filter by start time >= certain time
        }

        const timeslots = await statement.execute()
        return v.parse(schema.timeslotsSchema, timeslots)
    }
}
