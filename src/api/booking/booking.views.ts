import type { Request, Response } from "express";
import * as v from "valibot";

import BookingService from "./booking.service.js";
import * as schema from "./booking.schema.js";

export const bookingView = async (request: Request, response: Response) => {
  const bookings = await BookingService.findAll({});

  response.render("booking", { bookings });
};

export const bookingCreateView = async (
  request: Request,
  response: Response
) => {
  try {
    const newBooking = v.parse(schema.newBookingInSchema, request.body);
    await BookingService.create(newBooking);
    response.redirect("/");
  } catch (error) {
    const bookings = await BookingService.findAll({});
    response.render("booking", { bookings, error: "Ошибка" });
  }
};
