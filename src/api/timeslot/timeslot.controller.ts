import TimeslotService from './timeslot.service.js';

export default class TimeslotController {
    static findAll({ query }: any) {
        const slots = TimeslotService.findAll(query?.period);

        return {
            statusCode: 200,
            data: { slots },
        };
    }
}
