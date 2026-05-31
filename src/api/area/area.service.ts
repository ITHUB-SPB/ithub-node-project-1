import type { Kysely } from "kysely";
import type { Database } from "../../database/interface.js";
import type { Params } from "../lib/schema.js";

export default class AreaService {
  constructor(private db: Kysely<Database>) {}

  async findAll(params: Params) {
    const filter = params.queryParams.filter ?? "";
    const limit = params.queryParams.limit ?? 10;
    const offset = params.queryParams.offset ?? 0;

    let query = this.db
      .selectFrom("areas")
      .selectAll()
      .orderBy("title", "asc");

    if (filter) {
      const ids = filter.split(",").map(Number).filter((n) => !isNaN(n));
      if (ids.length > 0) {
        query = query.where("id", "in", ids);
      }
    }

    query = query.limit(limit).offset(offset);

    return await query.execute();
  }
}