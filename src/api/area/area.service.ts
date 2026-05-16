import * as v from "valibot";
import db from "../../database/connection.js";
import {
    areasSchema,
    areaSchema,
    type AreasSchema,
    type AreasQuerySchema,
} from "./area.schema.js";

export default class AreaService {
    static async findAll(queryParams: AreasQuerySchema): Promise<AreasSchema> {
        let statement = db
            .selectFrom("areas")
            .selectAll()
            .orderBy("areas.title");

        if (queryParams.limit) {
            statement = statement
                .limit(queryParams.limit)
                .offset(queryParams.offset || 0);
        }

        if (queryParams.filter?.length) {
            statement = statement.where("areas.id", "in", queryParams.filter);
        }

        if (queryParams.capacity) {
            statement = statement.where(
                "areas.capacity",
                ">=",
                queryParams.capacity,
            );
        }

        const areas = await statement.execute();

        return v.parse(areasSchema, areas);
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
