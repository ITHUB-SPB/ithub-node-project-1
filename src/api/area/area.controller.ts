import type { Request, Response, NextFunction } from "express";
import AreaService from "./area.service.js";
import { db } from "../../database/connection.js";



export default class AreaController {

  static async findAll(
    req: Request,
    res: Response,
    next: Function,
  ): Promise<void> {
    try {
      const areas = await new AreaService(db).findAll({
        pathParams: null,
        queryParams: {
          limit: req.query["limit"] ? Number(req.query["limit"]) : 10,
          offset: req.query["offset"] ? Number(req.query["offset"]) : 0,
          filter: req.query["filter"] ? String(req.query["filter"]) : "",
        },
      });

      res.status(200).json({
        statusCode: 200,
        data: {
          areas,
          totalItems: areas.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async findOne(
    req: Request,
    res: Response,
    next: Function,
  ): Promise<void> {
    try {
      const id = Number(req.params['id']);
      const area = await new AreaService(db).findOne(id);

      if (!area) {
        res.status(404).json({ statusCode: 404, data: { error: "Area not found" } });
        return;
      }

      res.status(200).json({ statusCode: 200, data: { area } });
    } catch (error) {
      next(error);
    }
  }
}
