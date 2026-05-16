import type { Request, Response } from "express";
import * as v from "valibot";

import BookingService from "./booking.service.js";
import TimeslotService from "../timeslot/timeslot.service.js";
import AreaService from "../area/area.service.js";
import * as schema from "./booking.schema.js";

async function getBookingPageData(roomId: number) {
    const room = await AreaService.findById(roomId);
    const timeslots = await TimeslotService.findAll();

    const bookedIds = await BookingService.findBookedTimeslotIdsByRoom(roomId);

    const availableTimeslots = timeslots.filter(
        (t) => !bookedIds.includes(Number(t.id)),
    );

    return {
        room,
        timeslots: availableTimeslots,
    };
}

export const bookingView = async (request: Request, response: Response) => {
    const roomId = Number(request.params["roomId"]);
    const data = await getBookingPageData(roomId);
    const bookings = await BookingService.findByRoomId(roomId);

    response.render("booking", { data, bookings });
};

export const bookingCreateView = async (
    request: Request,
    response: Response,
) => {
    const roomId = request.params["roomId"];

    try {
        const newBooking = v.parse(schema.newBookingInSchema, request.body);

        await BookingService.create({
            areaId: roomId,
            timeslotId: newBooking.timeslotId,
            title: newBooking.title,
            username: newBooking.username,
            createdAt: Math.floor(Date.now() / 1000),
        });

        const data = await getBookingPageData(roomId);

        response.render("booking", {
            ...data,
            success: "Бронирование успешно создано",
        });
    } catch (error) {
        const data = await getBookingPageData(roomId);

        response.render("booking", {
            ...data,
            error: "Ошибка бронирования",
        });
    }
};
