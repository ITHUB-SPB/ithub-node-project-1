import { type Request, type Response } from "express";
import * as v from "valibot";
import AreaService from "./area.service.js";
import * as schema from "./area.schema.js";
import db from "../../database/connection.js";

const service = new AreaService(db);

export default class AreaController {
  static async findAll(request: Request, response: Response): Promise<void> {
    const queryParams = v.parse(schema.areasQuerySchema, request.query);

    const params = {
      pathParams: null,
      queryParams: {
        filter: queryParams.filter?.join(",") ?? "",
        limit: queryParams.limit ?? 10,
        offset: queryParams.offset ?? 0,
      },
    };

    const areas = await service.findAll(params);

    response.status(200).json({
      statusCode: 200,
      data: {
        areas,
        totalItems: areas.length,
      },
    });
  }
}