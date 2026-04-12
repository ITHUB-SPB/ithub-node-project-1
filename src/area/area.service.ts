import * as v from "valibot";
import connection from "../database/connection.js";
import { areasSchema, type AreasSchema } from "./area.schema.js";
import type { Params } from "../lib/schema.js";

export default class AreaService {
  static findAll(params: Params): AreasSchema {
    const { filter = "", limit = 10, offset = 0 } = params.queryParams;

    let query = "SELECT * FROM areas";
    const queryParams: (string | number)[] = [];

    if (filter) {
      query += " WHERE title LIKE ?";
      queryParams.push(`%${filter}%`);
    }

    query += " ORDER BY title";

    if (limit !== undefined && offset !== undefined) {
      query += " LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    }

    const statement = connection.prepare(query);
    const areas = statement.all(...queryParams) as any[];

    return v.parse(areasSchema, areas);
  }
}
