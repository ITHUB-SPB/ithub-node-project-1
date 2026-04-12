import type { Params } from '../lib/schema.js';
import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    static findAll({ params }: { params: Params }): schema.AreasResponseSchema {
        const { filter, limit, offset } = params.queryParams;
        const areas = AreaService.findAll({ filter, limit, offset });
        const totalItems = areas.length;

        return {
            statusCode: 200,
            data: {
                areas,
                totalItems,
            },
        };
    }
}
