import { type Request, type Response } from 'express';
import * as v from 'valibot';
import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    static async findAll(request: Request, response: Response): Promise<Response<schema.AreasResponseSchema>> {
        const queryParams = v.parse(schema.areasQuerySchema, request.query);
        
        const areas = await AreaService.findAll(queryParams);

        const totalItems = areas.length;

        const data = {
            areas,
            totalItems
        };

       return response.status(200).json(data)
    }

    static findOne = async (request: Request, response: Response): Promise<void> => {
        try {
            const id = v.parse(
                v.pipe(
                    v.number(),
                    v.integer(),
                    v.minValue(1),
                ),
                Number(request.params.id),
            );

            const area = await AreaService.findOne(id);
            
            if (!area) {
                response.status(404).json({ error: 'Area not found' });
                return;
            }

            response.status(200).json(area);
        } catch (error: any) {
            response.status(400).json({ error: error.message });
        }
    };
}