import type { Request, Response } from "express";
import * as v from "valibot";

import AreaService from "./area.service.js";
import * as schema from "./area.schema.js";

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatBookingPeriod(start: number, end: number) {
  const startTime = timeFormatter.format(new Date(start * 1000));
  const endTime = timeFormatter.format(new Date(end * 1000));

  return `${startTime} - ${endTime}`;
}

function createSlots(bookings: Array<{ id: number; start: number; end: number }>) {
  if (bookings.length === 0) {
    return [
      {
        title: "Свободно",
        organizer: "Meeting Mate",
        period: "Нет занятых слотов",
      },
    ];
  }

  return bookings.map((booking) => ({
    title: `Booking #${booking.id}`,
    organizer: "Meeting Mate",
    period: formatBookingPeriod(booking.start, booking.end),
  }));
}

export const areasListView = async (request: Request, response: Response) => {
  const queryParams = v.parse(schema.areasQuerySchema, request.query);
  const selectedAreaIds = queryParams.filter?.length
    ? queryParams.filter
    : (queryParams.area ?? []);

  const roomsFilterRaw = await AreaService.findAll({});
  const roomsList = await AreaService.findAll(queryParams);
  const roomsFilter = roomsFilterRaw.map((room) => ({
    ...room,
    checked: selectedAreaIds.includes(room.id),
  }));

  response.render("index", {
    roomsFilter,
    rooms: roomsList,
    roomsCount: roomsList.length,
    filters: {
      plasma: Boolean(queryParams.plasma),
      board: Boolean(queryParams.board),
      wifi: Boolean(queryParams.wifi),
      capacity: queryParams.capacity?.toString() ?? "",
    },
  });
};

export const areaDetailView = async (request: Request, response: Response) => {
  const roomId = String(request.params["roomId"] ?? "");

  const room = await AreaService.findById(roomId);

  if (!room) {
    response.status(404);
    return response.send("Комната не найдена");
  }

  response.render("detail", {
    room: {
      ...room,
      wifiLabel: room.hasWifi ? "Yes" : "No",
      plasmaLabel: room.hasPlasma ? "Yes" : "No",
      boardLabel: room.hasBoard ? "Yes" : "No",
    },
    slots: createSlots(room.bookings),
  });
};
