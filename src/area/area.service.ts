import * as v from 'valibot'
import connection from '../database/connection.js'
import { areasSchema, type AreasSchema } from './area.schema.js'


export default class AreaService {
    static findAll(params: any): AreasSchema {
        let query = 'SELECT * FROM areas';
        const values: any[] = [];
        const conditions: string[] = [];

        if (params?.filter) {
            conditions.push('title LIKE ?');
            values.push(`%${params.filter}%`);
        }

        if (conditions.length) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (params?.limit) {
            query += ' LIMIT ?';
            values.push(params.limit);
        }

        if (params?.offset) {
            query += ' OFFSET ?';
            values.push(params.offset);
        }

        const statement = connection.prepare(query);
        const areas = statement.all(...values);

        return v.parse(areasSchema, areas);
    }
}
