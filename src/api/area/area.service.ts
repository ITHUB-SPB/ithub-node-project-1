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

        // TODO уточнить фильтры (а именно, фильтровать по множественным id комнат)
        // вариант запроса №1 ?filter[id][in]=1,3,4
        // вариант запроса №2 ?id[in]=1,3,4
        if (queryParams.filter) {
            // TODO перенести это действие в валибот
            const ids = queryParams.filter.split(',').map(Number)
            statement = statement.where('areas.id', 'in', ids)
        }

        // const statement = connection.prepare('select * from areas order by title')
        const areas = await statement.execute()

        return v.parse(areasSchema, areas)
    }
}
