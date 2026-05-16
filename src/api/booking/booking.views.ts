import type { Request, Response } from "express";
import * as v from "valibot";

import BookingService from "./booking.service.js";
import TimeslotService from "../timeslot/timeslot.service.js";
import AreaService from "../area/area.service.js";
import * as schema from "./booking.schema.js";

export const bookingView = async (request: Request, response: Response) => {
    const roomId = request.params["roomId"];

    const room = await AreaService.findById(roomId);
    const timeslots = await TimeslotService.findAll();

    response.render("booking", {
        room,
        timeslots,
    });
};

export const bookingCreateView = async (
    request: Request,
    response: Response,
) => {
    const roomId = request.params["roomId"];

    try {
        const newBooking = v.parse(schema.newBookingInSchema, request.body);

        await BookingService.create({
            areaId: Number(roomId),
            timeslotId: newBooking.timeslotId,
            createdAt: Math.floor(Date.now() / 1000),
        });

        const room = await AreaService.findById(roomId);
        const timeslots = await TimeslotService.findAll();

        return response.render("booking", {
            room,
            timeslots,
            success: "Бронирование успешно создано",
        });
    } catch (error) {
        const room = await AreaService.findById(roomId);
        const timeslots = await TimeslotService.findAll();

        response.render("booking", {
            room,
            timeslots,
            error: "Ошибка бронирования",
        });
    }
};
