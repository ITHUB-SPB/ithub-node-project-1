import { type Request, type Response } from "express";
import TimeslotService from "./timeslot.service.js";
import * as v from "valibot";
import * as schema from "./timeslot.schema.js";

export default class TimeslotController {
  static async findAll(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const query = v.parse(schema.timeslotsQuerySchema, request.query);

      const slots = await TimeslotService.findAll(query.period);

      return response.status(200).json({
        slots,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return response.status(400).json({
        error: message,
      });
    }
  }
}
