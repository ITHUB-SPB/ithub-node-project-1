import AreaService from './area.service.js';
import * as schema from './area.schema.js';
import type { Params } from '../lib/schema.js';

export default class AreaController {
    static findAll({ params }: { params: Params }): schema.AreasResponseSchema {
        const areas = AreaService.findAll(params);

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
