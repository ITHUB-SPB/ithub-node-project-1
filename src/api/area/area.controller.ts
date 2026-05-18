import { type Request, type Response } from "express";
import * as v from "valibot";
import AreaService from "./area.service.js";
import * as schema from "./area.schema.js";

export default class AreaController {
  static async getAll(request: Request, response: Response): Promise<Response> {
    const queryParams = v.parse(schema.areasQuerySchema, request.query);
    const result = await AreaService.getAll(queryParams);

    return response.status(200).json({
      items: result.items,
      total: result.totalCount,
    });
  }

  static async getById(request: Request, response: Response): Promise<void> {
    try {
      const id = v.parse(
        v.pipe(v.number(), v.integer(), v.minValue(1)),
        Number(request.params.id)
      );

      const area = await AreaService.getById(id);

      if (!area) {
        response.status(404).json({ message: "Помещение не найдено" });
        return;
      }

      response.status(200).json(area);
    } catch (error: any) {
      response.status(400).json({ error: error.message });
    }
  }
}