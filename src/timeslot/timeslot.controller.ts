import type { Params } from '../lib/schema.js';
import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';

export default class TimeslotController {
    static findAll({ params }: { params: Params }): schema.TimeslotsResponseSchema {
        const { filter } = params.queryParams;
        const timeslots = TimeslotService.findAll(filter);
        const totalItems = timeslots.length;

        return {
            statusCode: 200,
            data: {
                timeslots,
                totalItems,
            },
        };
    }
}
