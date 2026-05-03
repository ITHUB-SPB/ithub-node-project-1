import { type Request, type Response } from 'express';
import * as v from 'valibot';
import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';

export default class TimeslotController {
    static findAll = async (request: Request, response: Response): Promise<void> => {
        try {
            const query = v.parse(schema.timeslotsQuerySchema, request.query);
            
            let timeslots;
            if (query.time_from || query.time_to) {
                timeslots = await TimeslotService.findByTimeRange(query);
            } else {
                timeslots = await TimeslotService.findAll();
            }

            const responseData = v.parse(schema.timeslotsResponseSchema, {
                statusCode: 200,
                data: { timeslots },
            });

            response.status(responseData.statusCode).json(responseData.data);
        } catch (error: any) {
            console.error(error);
            response.status(400).json({ error: error.message || 'Bad request' });
        }
    };
}