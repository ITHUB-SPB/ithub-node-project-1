import type { Request, Response, NextFunction } from "express";
import TimeslotService from "./timeslot.service.js";
import { db } from "../../database/connection.js";

export default class TimeslotController {
  static async findAll(
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        const timeslots = await new TimeslotService(db).findAll({
          pathParams: null, 
        queryParams: {
          limit: req.query["limit"] ? Number(req.query["limit"]) : undefined,
          offset: req.query["offset"] ? Number(req.query["offset"]) : undefined,
          filter: req.query["filter"] ? String(req.query["filter"]) : undefined,
          sort: req.query["sort"] ? String(req.query["sort"]) : undefined,
        },
      });
  
        res.status(200).json({
          statusCode: 200,
          data: {
            timeslots,
            totalItems: timeslots.length,
          },
        });
      } catch (error) {
        next(error);
      }
    }
}


