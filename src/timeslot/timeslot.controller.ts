import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';
import type { Params } from '../lib/schema.js';

export default class TimeslotController {
    static findAll({ params }: { params: Params }): schema.TimeslotsResponseSchema {
        const timeslots = TimeslotService.findAll(params);
        return {
            statusCode: 200,
            data: timeslots,
        };
    }
}
