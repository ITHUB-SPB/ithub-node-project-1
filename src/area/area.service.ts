import * as v from 'valibot'
import connection from '../database/connection.js'
import { areasSchema, type AreasSchema } from './area.schema.js'


export default class AreaService {
    static findAll(): AreasSchema {
        const statement = connection.prepare('select * from areas order by title')
        const areas = statement.all()

        return v.parse(areasSchema, areas)
    }
}
