import { type Request, type Response } from 'express';
import * as v from 'valibot';
import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    static async findAll(request: Request, response: Response) {
        const queryParams = v.parse(schema.areasQuerySchema, request.query);
        const areas = await AreaService.findAll(queryParams);

        return response.status(200).json({
            areas,
            totalItems: areas.length,
        });
    }

    static async findOne(request: Request, response: Response) {
        const params = v.parse(schema.areaParamsSchema, request.params);

        const area = await AreaService.findOne(params.id);

        if (!area) {
            return response.status(404).json({
                message: 'Area not found',
            });
        }

        return response.status(200).json({
            area,
        });
    }
}
