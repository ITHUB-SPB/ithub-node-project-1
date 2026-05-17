import * as v from "valibot";
import db from "../../database/connection.js";
import {
  areaDetailSchema,
  areasSchema,
  type AreaDetailSchema,
  type AreasQuerySchema,
  type AreasSchema,
} from "./area.schema.js";

export default class AreaService {
  static async findAll(queryParams: AreasQuerySchema = {}): Promise<AreasSchema> {
    let statement = db.selectFrom("areas").selectAll().orderBy("areas.title");

    if (queryParams.limit !== undefined) {
      const offset = queryParams.offset ?? 0;
      statement = statement.limit(queryParams.limit).offset(offset);
    }

    const areaIds = queryParams.filter?.length
      ? queryParams.filter
      : queryParams.area;

    if (areaIds?.length) {
      statement = statement.where("id", "in", areaIds);
    }

    if (queryParams.capacity !== undefined) {
      statement = statement.where("areas.capacity", ">=", queryParams.capacity);
    }

    if (queryParams.plasma) {
      statement = statement.where("areas.hasPlasma", "=", 1);
    }

    if (queryParams.board) {
      statement = statement.where("areas.hasBoard", "=", 1);
    }

    if (queryParams.wifi) {
      statement = statement.where("areas.hasWifi", "=", 1);
    }

    const areas = await statement.execute();
    return v.parse(areasSchema, areas);
  }

  static async findById(roomId: string | number): Promise<AreaDetailSchema | null> {
    const id = Number(roomId);

    if (!Number.isInteger(id) || id < 1) {
      return null;
    }

    const area = await db
      .selectFrom("areas")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!area) {
      return null;
    }

    const bookings = await db
      .selectFrom("bookings")
      .selectAll()
      .where("bookings.areaId", "=", id)
      .orderBy("bookings.start")
      .execute();

    return v.parse(areaDetailSchema, { ...area, bookings });
  }
}
