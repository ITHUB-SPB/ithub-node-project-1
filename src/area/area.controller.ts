import AreaService from './area.service.js';
import * as schema from './area.schema.js';
import type { Params } from '../lib/schema.js';

export default class AreaController {
    // TODO
    static findAll({ params }: { params: Params }): schema.AreasResponseSchema {
        const areas = AreaService.findAll(params);

        const totalItems = areas.length;

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
