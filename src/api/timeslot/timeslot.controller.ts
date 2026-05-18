import { type Request, type Response } from "express";
import * as v from "valibot";
import TimeslotService from "./timeslot.service.js";
import * as schema from "./timeslot.schema.js";

export default class TimeslotController {
  static async getAll(request: Request, response: Response): Promise<void> {
    try {
      const filters = v.parse(schema.timeslotFiltersSchema, request.query);

      let timeslots;
      if (filters.startTime || filters.endTime) {
        timeslots = await TimeslotService.filterByTimeRange(filters);
      } else {
        timeslots = await TimeslotService.getAll();
      }

      response.status(200).json({
        slots: timeslots,
        count: timeslots.length,
      });
    } catch (error: any) {
      response.status(400).json({ error: error.message || "Ошибка запроса" });
    }
  }
}