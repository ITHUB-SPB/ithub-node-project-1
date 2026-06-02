import * as v from "valibot";
import { sql } from "kysely";
import db from "../../database/connection.js";
import {
  areasSchema,
  areaSchema,
  type AreasSchema,
  type AreasQuerySchema,
} from "./area.schema.js";

export default class AreaService {
  static async findAll(queryParams: AreasQuerySchema): Promise<AreasSchema> {
    let statement = db.selectFrom("areas").selectAll().orderBy("areas.title");

    if (queryParams.filter?.length) {
      statement = statement.where("areas.id", "in", queryParams.filter);
    }

    if (queryParams.capacity) {
      statement = statement.where("areas.capacity", ">=", queryParams.capacity);
    }

    if (queryParams.wifi === "1") {
      statement = statement.where("areas.wifi", "=", 1);
    }

    if (queryParams.board === "1") {
      statement = statement.where("areas.board", "=", 1);
    }

    if (queryParams.plasma === "1") {
      statement = statement.where("areas.plasma", "=", 1);
    }

    if (queryParams.limit) {
      statement = statement
        .limit(queryParams.limit)
        .offset(queryParams.offset || 0);
    }

    const areas = await statement.execute();

    return v.parse(areasSchema, areas);
  }

  static async findAllWithTotal(
    queryParams: AreasQuerySchema,
  ): Promise<{ areas: AreasSchema; totalItems: number }> {
    const baseQuery = db.selectFrom("areas");

    let statement = baseQuery.selectAll().orderBy("areas.title");
    let countQuery = baseQuery.select(sql`count(*)`.as("count"));

    if (queryParams.filter?.length) {
      statement = statement.where("areas.id", "in", queryParams.filter);
      countQuery = countQuery.where("areas.id", "in", queryParams.filter);
    }

    if (queryParams.capacity) {
      statement = statement.where("areas.capacity", ">=", queryParams.capacity);
      countQuery = countQuery.where(
        "areas.capacity",
        ">=",
        queryParams.capacity,
      );
    }

    if (queryParams.wifi === "1") {
      statement = statement.where("areas.wifi", "=", 1);
      countQuery = countQuery.where("areas.wifi", "=", 1);
    }

    if (queryParams.board === "1") {
      statement = statement.where("areas.board", "=", 1);
      countQuery = countQuery.where("areas.board", "=", 1);
    }

    if (queryParams.plasma === "1") {
      statement = statement.where("areas.plasma", "=", 1);
      countQuery = countQuery.where("areas.plasma", "=", 1);
    }

    const totalItemsRow = await countQuery.executeTakeFirst();
    const totalItems = Number(totalItemsRow?.count ?? 0);

    if (queryParams.limit) {
      statement = statement
        .limit(queryParams.limit)
        .offset(queryParams.offset || 0);
    }

    const areas = await statement.execute();

    return {
      areas: v.parse(areasSchema, areas),
      totalItems,
    };
  }

  static async findById(id: number | string) {
    const room = await db
      .selectFrom("areas")
      .selectAll()
      .where("id", "=", Number(id))
      .executeTakeFirst();

    if (!room) {
      throw new Error("Комната не найдена");
    }

    return v.parse(areaSchema, room);
  }
}
