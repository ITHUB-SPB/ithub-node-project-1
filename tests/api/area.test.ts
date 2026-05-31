import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, test, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
    findAllAreas: vi.fn(),
    findAllBookings: vi.fn(),
    createBooking: vi.fn(),
    deleteBooking: vi.fn(),
    findAllTimeslots: vi.fn(),
}));

vi.mock("../../src/api/area/area.service.js", () => ({
    default: {
        findAll: serviceMocks.findAllAreas,
    },
}));

vi.mock("../../src/api/booking/booking.service.js", () => ({
    default: {
        findAll: serviceMocks.findAllBookings,
        create: serviceMocks.createBooking,
        delete: serviceMocks.deleteBooking,
    },
}));

vi.mock("../../src/api/timeslot/timeslot.service.js", () => ({
    default: {
        findAll: serviceMocks.findAllTimeslots,
    },
}));

import { areaRoutes } from "../../src/api/area/area.router";
import { bookingRoutes } from "../../src/api/booking/booking.router";
import { timeslotRoutes } from "../../src/api/timeslot/timeslot.router";

const app = express();
app.use(express.json());
app.use(areaRoutes);
app.use(bookingRoutes);
app.use(timeslotRoutes);

beforeEach(() => {
    vi.clearAllMocks();
});

describe("GET /api/areas", () => {
    test("возвращает список помещений", async () => {
        serviceMocks.findAllAreas.mockResolvedValue([
            {
                id: 1,
                title: "Помещение 1",
                capacity: 10,
                wifi: 1,
                board: 0,
                plasma: 1,
            },
        ]);

        const response = await request(app).get("/api/areas");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            areas: [
                {
                    id: 1,
                    title: "Помещение 1",
                    capacity: 10,
                    wifi: 1,
                    board: 0,
                    plasma: 1,
                },
            ],
            totalItems: 1,
        });
    });
});

describe("GET /api/bookings", () => {
    test("возвращает список бронирований", async () => {
        serviceMocks.findAllBookings.mockResolvedValue([
            {
                id: 1,
                areaId: 1,
                timeslotId: 2,
                title: "Встреча",
                username: "ivan",
                createdAt: 100,
            },
        ]);

        const response = await request(app).get("/api/bookings");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            bookings: [
                {
                    id: 1,
                    areaId: 1,
                    timeslotId: 2,
                    title: "Встреча",
                    username: "ivan",
                    createdAt: 100,
                },
            ],
        });
    });
});

describe("POST /api/bookings", () => {
    test("создает бронирование", async () => {
        serviceMocks.createBooking.mockResolvedValue({
            id: 1,
            timeslotId: 2,
            createdAt: 100,
        });

        const response = await request(app).post("/api/bookings").send({
            title: "Встреча",
            username: "ivan",
            timeslotId: 2,
        });

        expect(response.status).toBe(201);
        expect(serviceMocks.createBooking).toHaveBeenCalledWith({
            timeslotId: 2,
            createdAt: expect.any(Number),
        });
        expect(response.body.booking).toEqual({
            id: 1,
            timeslotId: 2,
            createdAt: 100,
        });
    });

    test("возвращает ошибку при неверных данных", async () => {
        const response = await request(app).post("/api/bookings").send({
            title: "",
            username: "",
            timeslotId: 0,
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
    });
});

describe("DELETE /api/bookings/:id", () => {
    test("удаляет бронирование", async () => {
        const response = await request(app).delete("/api/bookings/3");

        expect(response.status).toBe(204);
        expect(serviceMocks.deleteBooking).toHaveBeenCalledWith(3);
    });

    test("возвращает ошибку при неверном id", async () => {
        const response = await request(app).delete("/api/bookings/0");

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
    });
});

describe("GET /api/timeslots", () => {
    test("возвращает список слотов", async () => {
        serviceMocks.findAllTimeslots.mockResolvedValue([
            { id: 1, start: "10:00", end: "11:00" },
        ]);

        const response = await request(app).get("/api/timeslots");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            slots: [{ id: 1, start: "10:00", end: "11:00" }],
        });
    });

    test("передает фильтр периода", async () => {
        serviceMocks.findAllTimeslots.mockResolvedValue([
            { id: 2, start: "15:00", end: "16:00" },
        ]);

        const response = await request(app).get("/api/timeslots?period=PM");

        expect(response.status).toBe(200);
        expect(serviceMocks.findAllTimeslots).toHaveBeenCalledWith("PM");
    });
});
