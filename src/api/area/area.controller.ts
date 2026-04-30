import { type Request, type Response } from 'express';
import * as v from 'valibot';
import AreaService from './area.service.js';
import * as schema from './area.schema.js';

export default class AreaController {
  static async findAll(request: Request, response: Response) {
    const queryParams = v.parse(schema.areasQuerySchema, request.query);
    const areas = await AreaService.findAll(queryParams);

    return response.status(200).json({
      areas,
      totalItems: areas.length,
    });
  }
}