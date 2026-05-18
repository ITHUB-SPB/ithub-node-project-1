import * as v from "valibot";
import db from "../../database/connection.js";
import { areaItemSchema, type AreaItem, type AreasQuery } from "./area.schema.js";

export default class AreaService {
  static async getAll(query: AreasQuery): Promise<{ items: AreaItem[]; totalCount: number }> {
    let statement = db.selectFrom("areas").selectAll().orderBy("title");

    if (query.search) {
      statement = statement.where("title", "like", `%${query.search}%`);
    }

    const countResult = await statement
      .select((eb) => eb.fn.countAll().as("count"))
      .executeTakeFirst();

    if (query.limit) {
      const offset = query.offset ?? 0;
      statement = statement.limit(query.limit).offset(offset);
    }

    const areas = await statement.execute();
    const validatedAreas = v.parse(areasListSchema, areas);

    return {
      items: validatedAreas,
      totalCount: Number(countResult?.count) ?? 0,
    };
  }

  static async getById(id: number): Promise<AreaItem | null> {
    const area = await db
      .selectFrom("areas")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!area) return null;

    return v.parse(areaItemSchema, area);
  }
}