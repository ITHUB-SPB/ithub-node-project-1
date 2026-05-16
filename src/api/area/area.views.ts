import type { Request, Response } from "express";
import * as v from "valibot";

import AreaService from "./area.service.js";
import BookingService from "../booking/booking.service.js";
import * as schema from "./area.schema.js";

export const areasListView = async (request: Request, response: Response) => {
    const queryParams = v.parse(schema.areasQuerySchema, request.query);

    const roomsFilter = await AreaService.findAll({});
    const roomsList = await AreaService.findAll(queryParams);

    response.render("index", {
        roomsFilter,
        rooms: roomsList,
        query: queryParams,
        totalRooms: roomsList.length,
    });
};

export const areaDetailView = async (request: Request, response: Response) => {
    const roomId = request.params["roomId"];

    const room = await AreaService.findById(roomId);
    const bookings = await BookingService.findByRoomId(roomId);

    response.render("detail", { room, bookings });
};
