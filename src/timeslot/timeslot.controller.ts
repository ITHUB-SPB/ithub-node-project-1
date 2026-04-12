import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';

export default class TimeslotController {
    static findAll({ params }: any): schema.TimeslotsResponseSchema {
        const timeslots = TimeslotService.findAll(params.queryParams);

        return {
            statusCode: 200,
            data: {
                timeslots,
            },
        };
    }
}
