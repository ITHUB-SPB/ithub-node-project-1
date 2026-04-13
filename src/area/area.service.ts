import * as v from 'valibot'
import connection from '../database/connection.js'
import { areasSchema, type AreasSchema, type AreasQuerySchema } from './area.schema.js'


export default class AreaService {
    static findAll(queryParams: AreasQuerySchema): AreasSchema {
        const statement = connection.prepare('select * from areas order by title')
        const areas = statement.all()

        console.log('!', queryParams)

        return v.parse(areasSchema, areas)
    }
}
