import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    // TODO
    static findAll(): schema.AreasResponseSchema {
        const areas = AreaService.findAll() // TODO
        const totalItems = areas.length

        const data = {
            areas,
            totalItems
        }

        return {
            statusCode: 200,
            data,
        };
    }
}
