import { type Request, type Response } from 'express';
import TimeslotService from './timeslot.service.js';

type QueryParams = {
    timeOfDay?: string | undefined
}

export default class TimeslotController {
    static async findAll(request: Request, response: Response) {
        try {
            const timeOfDay = request.query['timeOfDay'] as string | undefined
            const queryParams: QueryParams = {
                timeOfDay: timeOfDay
            }

            const timeslots = await TimeslotService.findAll(queryParams)

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
