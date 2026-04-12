import * as v from 'valibot'
import connection from '../database/connection.js'
import { areasSchema, type AreasSchema } from './area.schema.js'

type AreaQuery = {
    filter?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
};

export default class AreaService {
    static findAll({ filter, limit, offset }: AreaQuery): AreasSchema {
        const segments = ['select * from areas'];
        const values: Array<string | number> = [];

        if (filter?.trim()) {
            segments.push('where title like ?');
            values.push(`%${filter.trim()}%`);
        }

        segments.push('order by title');

        if (limit != null) {
            segments.push('limit ?');
            values.push(limit);
        }

        if (offset != null) {
            segments.push('offset ?');
            values.push(offset);
        }

        const statement = connection.prepare(segments.join(' '));
        const areas = statement.all(...values);

        return v.parse(areasSchema, areas);
    }
}
