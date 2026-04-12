import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    static findAll({ query }: any): schema.AreasResponseSchema {
        const areas = AreaService.findAll(query);
        return {
            statusCode: 200,
            data: {
                areas,
                totalItems: areas.length,
            }
        }
    }
}
