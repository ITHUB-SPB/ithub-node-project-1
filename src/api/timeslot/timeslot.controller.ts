import { type Request, type Response } from 'express';
import TimeslotService from './timeslot.service.js';
import * as schema from './timeslot.schema.js';

export default class TimeslotController {
    static async findAll(request: Request, response: Response) {
        try {
            const timeslots = await TimeslotService.findAll()

            response.statusCode = 200
            return response.json({
                timeslots: timeslots,
            })
        } catch (error) {
            console.error(error);
            response.statusCode = 500
            return response.json({
                error: error instanceof Error ? error.message : 'Internal server error',
            })
        }
    }
}
