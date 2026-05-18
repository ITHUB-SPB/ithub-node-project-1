import { type Request, type Response } from "express";
import * as v from "valibot";
import BookingService from "./booking.service.js";
import * as schema from "./booking.schema.js";

export default class BookingController {
  static async list(request: Request, response: Response): Promise<void> {
    try {
      const filters = v.parse(schema.bookingFiltersSchema, request.query);
      const result = await BookingService.getList(filters);

      response.status(200).json({
        records: result.data,
        pagination: {
          total: result.totalItems,
          limit: filters.limit ?? null,
          offset: filters.offset ?? null,
        },
      });
    } catch (error: any) {
      response.status(400).json({ error: error.message || "Неверный запрос" });
    }
  }

  static async add(request: Request, response: Response): Promise<void> {
    try {
      const payload = v.parse(schema.createBookingSchema, request.body);
      const created = await BookingService.add(payload);

      response.status(201).json({ booking: created });
    } catch (error: any) {
      response.status(400).json({ error: error.message || "Ошибка валидации" });
    }
  }

  static async remove(request: Request, response: Response): Promise<void> {
    try {
      const id = v.parse(
        v.pipe(v.number(), v.integer(), v.minValue(1)),
        Number(request.params.id)
      );

      await BookingService.remove(id);
      response.status(204).send();
    } catch (error: any) {
      if (error.message?.includes("не найдено")) {
        response.status(404).json({ error: error.message });
      } else {
        response.status(400).json({ error: error.message || "Ошибка запроса" });
      }
    }
  }
}