import * as v from "valibot";
import db from "../../database/connection.js";
import {
  areaSchema,
  areasSchema,
  type AreasQuerySchema,
} from "./area.schema.js";

export default class AreaService {
  static async findAll(queryParams: AreasQuerySchema) {
    let statement = db.selectFrom("areas").selectAll().orderBy("areas.title");

    if (queryParams.filter) {
      statement = statement.where(
        "areas.title",
        "like",
        `%${queryParams.filter}%`,
      );
    }

    if (queryParams.limit) {
      statement = statement.limit(queryParams.limit);
    }

    if (queryParams.offset !== undefined) {
      statement = statement.offset(queryParams.offset);
    }

    const areas = await statement.execute();

    return v.parse(areasSchema, areas);
  }

  static async findOne(id: number) {
    const area = await db
      .selectFrom("areas")
      .selectAll()
      .where("areas.id", "=", id)
      .executeTakeFirst();

    if (!area) {
      return null;
    }

    return v.parse(areaSchema, area);
  }
}
