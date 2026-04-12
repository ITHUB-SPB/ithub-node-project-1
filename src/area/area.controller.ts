import AreaService from './area.service.js';
import * as schema from './area.schema.js';
import type { Params } from '../lib/schema.js';


export default class AreaController {
    // TODO
    static async findAll(params: Params): Promise<schema.AreasResponseSchema> {
        const { filter, limit, offset } = params.queryParams;
        const { areas, totalItems } = await AreaService.findAll({ filter, limit, offset });

        const data = {
            areas,
            totalItems,
        };

        return {
            statusCode: 200,
            data,
        };
    }
}
