import * as v from 'valibot';
import db from '../../database/connection.js';
import { areasSchema, type AreasSchema, type AreasQuerySchema } from './area.schema.js';

export default class AreaService {
    static async findAll(queryParams: AreasQuerySchema): Promise<AreasSchema> {
        let statement = db.selectFrom('areas').selectAll().orderBy('areas.title');

        if (queryParams.limit) {
            const offset = queryParams.offset || 0;
            statement = statement.limit(queryParams.limit).offset(offset);
        }

        if (queryParams.filter) {
            const ids = queryParams.filter.split(',').map(Number);
            statement = statement.where('areas.id', 'in', ids);
        }

        const areas = await statement.execute();
        return v.parse(areasSchema, areas);
    }

    static async findOne(id: number) {
        const area = await db.selectFrom('areas')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        return area || null;
    }
}