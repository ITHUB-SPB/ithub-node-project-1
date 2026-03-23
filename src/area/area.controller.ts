import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
    static findAll(): schema.AreasResponseSchema {
        try {
            return {
                statusCode: 200,
                data: {
                    areas: AreaService.findAll()
                },
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: 400,
                data: {
                    error: (error as Error).message || '',
                },
            };
        }
    }
}
