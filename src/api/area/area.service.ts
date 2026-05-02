import * as v from 'valibot'
import db from '../../database/connection.js'
import { areasSchema, type AreasSchema, type AreasQuerySchema } from './area.schema.js'


export default class AreaService {
    static async findAll(queryParams: AreasQuerySchema): Promise<AreasSchema> {
        let statement = db.selectFrom('areas').selectAll().orderBy('areas.title')

        if (queryParams.limit) {
            const offset = queryParams.offset || 0
            statement = statement.limit(queryParams.limit).offset(offset)
        }

        if (queryParams.filter?.length) {
            statement = statement.where('areas.id', 'in', queryParams.filter)
        }

        // const statement = connection.prepare('select * from areas order by title')
        const areas = await statement.execute()

        return v.parse(areasSchema, areas)
    }
}