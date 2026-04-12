import * as v from 'valibot';

import { Timeslot } from './timeslot.model.js';
import * as schema from './timeslot.schema.js';
import connection from '../database/connection.js';

export default class TimeslotService {
    static findAll() {
        return v.parse(schema.timeslotsSchema, []);
    }
}
