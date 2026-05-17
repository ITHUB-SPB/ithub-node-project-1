import type { Request, Response } from "express";

import AreaService from "../area/area.service.js";
import BookingService from "./booking.service.js";

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

function parseUnixTime(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleanValue = value.trim();

  if (cleanValue.length === 0) {
    return null;
  }

  const fromNumber = Number(cleanValue);

  if (Number.isInteger(fromNumber) && fromNumber > 0) {
    return fromNumber;
  }

  const timeMatch = cleanValue.match(/^(\d{2}):(\d{2})$/);

  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);

    if (hours <= 23 && minutes <= 59) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return Math.floor(date.getTime() / 1000);
    }
  }

  const fromDate = new Date(cleanValue).getTime();

  if (!Number.isNaN(fromDate)) {
    return Math.floor(fromDate / 1000);
  }

  return null;
}

export const bookingView = async (request: Request, response: Response) => {
  const roomId = Number(request.params["roomId"]);

  if (!Number.isInteger(roomId) || roomId < 1) {
    response.status(404);
    return response.send("Комната не найдена");
  }

  const room = await AreaService.findById(roomId);

  if (!room) {
    response.status(404);
    return response.send("Комната не найдена");
  }

  const bookings = await BookingService.findAll({ areaId: roomId });

  response.render("booking", {
    room,
    bookings,
    slots: createSlots(bookings),
    form: {
      topic: "",
      organizer: "",
      start: "",
      end: "",
    },
  });
};

export const bookingCreateView = async (
  request: Request,
  response: Response
) => {
  const roomId = Number(request.params["roomId"]);

  if (!Number.isInteger(roomId) || roomId < 1) {
    response.status(404);
    return response.send("Комната не найдена");
  }

  const room = await AreaService.findById(roomId);

  if (!room) {
    response.status(404);
    return response.send("Комната не найдена");
  }

  try {
    const start = parseUnixTime(request.body["start"]);
    const end = parseUnixTime(request.body["end"]);

    if (start === null || end === null) {
      throw new Error("Некорректное время");
    }

    if (start >= end) {
      throw new Error("Время начала должно быть меньше времени окончания");
    }

    const existingBookings = await BookingService.findAll({ areaId: roomId });
    const hasIntersection = existingBookings.some(
      (booking) => start < booking.end && end > booking.start
    );

    if (hasIntersection) {
      throw new Error("Этот слот уже занят");
    }

    await BookingService.create({
      areaId: roomId,
      start,
      end,
      createdAt: Math.floor(Date.now() / 1000),
    });

    response.redirect(`/rooms/${roomId}`);
  } catch (error) {
    const bookings = await BookingService.findAll({ areaId: roomId });
    const errorMessage = error instanceof Error ? error.message : "Ошибка";
    response.render("booking", {
      room,
      bookings,
      slots: createSlots(bookings),
      error: errorMessage,
      form: {
        topic:
          typeof request.body["topic"] === "string" ? request.body["topic"] : "",
        organizer:
          typeof request.body["organizer"] === "string"
            ? request.body["organizer"]
            : "",
        start: typeof request.body["start"] === "string" ? request.body["start"] : "",
        end: typeof request.body["end"] === "string" ? request.body["end"] : "",
      },
    });
  }
};
