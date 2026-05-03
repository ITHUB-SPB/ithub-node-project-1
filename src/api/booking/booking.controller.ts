import type { Request, Response, NextFunction } from "express";
import * as v from "valibot";

import { Timeslot } from "../timeslot/timeslot.model.js";
import BookingService from "./booking.service.js";
import * as schema from "./booking.schema.js";
import type { Params } from "../lib/schema.js";
import { db } from "../../database/connection.js";

export default class BookingController {

  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bookings = await new BookingService(db).findAll();

      const response: schema.BookingsResponseSchema = {
        statusCode: 200,
        data: {
          bookings,
          totalItems: bookings.length,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payloadObject = v.parse(schema.newBookingInSchema, req.body);

      const slotObject = Timeslot.fromMapped(payloadObject);

      const createdBooking = await new BookingService(db).create({
        ...slotObject.toMapped(),
        createdAt: Math.floor(Date.now() / 1000),
      });

      const response = v.parse(schema.newBookingOutSchema, {
        statusCode: 201,
        data: {
          booking: createdBooking,
        },
      });

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({
        statusCode: 400,
        data: { error: error.message || "ошибка валидации" },
      });
    }
  }

  static async delete(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const params: Params = {
        pathParams: {
          id: Number(req.params["id"]),
        },
        queryParams: {},
      };

      const validated = v.parse(schema.bookingDeleteSchema, { params });
      const id = validated.params.pathParams.id;

      await BookingService.delete(id);

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({
        statusCode: 400,
        data: { error: error.message || "ошибка при удалении" },
      });
    }
  }
}