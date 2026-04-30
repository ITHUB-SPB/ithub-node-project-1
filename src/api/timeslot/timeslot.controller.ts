import { type Request, type Response } from 'express';
import * as v from 'valibot';
import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';

export default class TimeslotController {
    static async findAll(request: Request, response: Response) {
        const queryParams = v.parse(schema.timeslotsQuerySchema, request.query);
        const timeslots = await TimeslotService.findAll(queryParams);

        return response.status(200).json({
            timeslots,
            totalItems: timeslots.length,
        });
    }
}
