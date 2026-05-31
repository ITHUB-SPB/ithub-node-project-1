import { beforeEach, describe, expect, test, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
    selectExecute: vi.fn(),
    selectExecuteTakeFirst: vi.fn(),
    selectLimit: vi.fn(),
    selectOffset: vi.fn(),
    selectWhere: vi.fn(),
    selectOrderBy: vi.fn(),
    selectSelectAll: vi.fn(),
    selectFrom: vi.fn(),
    insertExecuteTakeFirst: vi.fn(),
    insertReturningAll: vi.fn(),
    insertValues: vi.fn(),
    insertInto: vi.fn(),
    deleteExecute: vi.fn(),
    deleteWhere: vi.fn(),
    deleteFrom: vi.fn(),
}));

vi.mock("../../src/database/connection.js", () => ({
    default: {
        selectFrom: dbMocks.selectFrom,
        insertInto: dbMocks.insertInto,
        deleteFrom: dbMocks.deleteFrom,
    },
}));

import AreaService from "../../src/api/area/area.service";
import BookingService from "../../src/api/booking/booking.service";
import TimeslotService from "../../src/api/timeslot/timeslot.service";

beforeEach(() => {
    vi.clearAllMocks();

    dbMocks.selectExecute.mockResolvedValue([]);
    dbMocks.selectExecuteTakeFirst.mockResolvedValue(undefined);

    dbMocks.selectLimit.mockReturnValue({
        offset: dbMocks.selectOffset,
    });
    dbMocks.selectOffset.mockReturnValue({
        where: dbMocks.selectWhere,
        execute: dbMocks.selectExecute,
    });
    dbMocks.selectWhere.mockReturnValue({
        where: dbMocks.selectWhere,
        execute: dbMocks.selectExecute,
        executeTakeFirst: dbMocks.selectExecuteTakeFirst,
    });
    dbMocks.selectOrderBy.mockReturnValue({
        limit: dbMocks.selectLimit,
        where: dbMocks.selectWhere,
        execute: dbMocks.selectExecute,
    });
    dbMocks.selectSelectAll.mockReturnValue({
        orderBy: dbMocks.selectOrderBy,
        where: dbMocks.selectWhere,
        execute: dbMocks.selectExecute,
    });
    dbMocks.selectFrom.mockReturnValue({
        selectAll: dbMocks.selectSelectAll,
        innerJoin: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: dbMocks.selectExecute,
                }),
            }),
        }),
        select: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
                execute: dbMocks.selectExecute,
            }),
        }),
    });

    dbMocks.insertReturningAll.mockReturnValue({
        executeTakeFirst: dbMocks.insertExecuteTakeFirst,
    });
    dbMocks.insertValues.mockReturnValue({
        returningAll: dbMocks.insertReturningAll,
    });
    dbMocks.insertInto.mockReturnValue({
        values: dbMocks.insertValues,
    });

    dbMocks.deleteWhere.mockReturnValue({
        execute: dbMocks.deleteExecute,
    });
    dbMocks.deleteFrom.mockReturnValue({
        where: dbMocks.deleteWhere,
    });
});

describe("AreaService.findAll", () => {
    test("возвращает список помещений", async () => {
        const areas = [
            {
                id: 1,
                title: "Помещение 1",
                capacity: 10,
                wifi: 1,
                board: 0,
                plasma: 1,
            },
        ];

        dbMocks.selectExecute.mockResolvedValue(areas);

        const result = await AreaService.findAll({});

        expect(result).toEqual(areas);
        expect(dbMocks.selectFrom).toHaveBeenCalledWith("areas");
        expect(dbMocks.selectOrderBy).toHaveBeenCalledWith("areas.title");
    });

    test("добавляет limit и offset", async () => {
        await AreaService.findAll({ limit: 2, offset: 3 });

        expect(dbMocks.selectLimit).toHaveBeenCalledWith(2);
        expect(dbMocks.selectOffset).toHaveBeenCalledWith(3);
    });

    test("добавляет фильтры", async () => {
        await AreaService.findAll({
            filter: [1, 2],
            capacity: 8,
            wifi: "1",
            board: "1",
            plasma: "1",
        });

        expect(dbMocks.selectWhere).toHaveBeenNthCalledWith(1, "areas.id", "in", [
            1, 2,
        ]);
        expect(dbMocks.selectWhere).toHaveBeenNthCalledWith(
            2,
            "areas.capacity",
            ">=",
            8,
        );
        expect(dbMocks.selectWhere).toHaveBeenNthCalledWith(
            3,
            "areas.wifi",
            "=",
            1,
        );
        expect(dbMocks.selectWhere).toHaveBeenNthCalledWith(
            4,
            "areas.board",
            "=",
            1,
        );
        expect(dbMocks.selectWhere).toHaveBeenNthCalledWith(
            5,
            "areas.plasma",
            "=",
            1,
        );
    });
});

describe("AreaService.findById", () => {
    test("возвращает помещение по id", async () => {
        const area = {
            id: 2,
            title: "Помещение 2",
            capacity: 12,
            wifi: 1,
            board: 1,
            plasma: 0,
        };

        dbMocks.selectExecuteTakeFirst.mockResolvedValue(area);

        const result = await AreaService.findById(2);

        expect(result).toEqual(area);
        expect(dbMocks.selectWhere).toHaveBeenCalledWith("id", "=", 2);
    });

    test("выбрасывает ошибку если помещения нет", async () => {
        dbMocks.selectExecuteTakeFirst.mockResolvedValue(undefined);

        await expect(AreaService.findById(999)).rejects.toThrow(
            "Комната не найдена",
        );
    });
});

describe("BookingService.delete", () => {
    test("удаляет бронирование по id", async () => {
        await BookingService.delete(4);

        expect(dbMocks.deleteFrom).toHaveBeenCalledWith("bookings");
        expect(dbMocks.deleteWhere).toHaveBeenCalledWith("id", "=", 4);
        expect(dbMocks.deleteExecute).toHaveBeenCalled();
    });
});

describe("BookingService.create", () => {
    test("создает бронирование", async () => {
        const booking = {
            id: 1,
            timeslotId: 2,
            createdAt: 100,
        };

        dbMocks.insertExecuteTakeFirst.mockResolvedValue(booking);

        const payload = {
            timeslotId: 2,
            createdAt: 100,
        };

        const result = await BookingService.create(payload);

        expect(dbMocks.insertInto).toHaveBeenCalledWith("bookings");
        expect(dbMocks.insertValues).toHaveBeenCalledWith(payload);
        expect(result).toEqual(booking);
    });
});

describe("BookingService.findAll", () => {
    test("возвращает все бронирования", async () => {
        const bookings = [
            {
                id: 1,
                areaId: 1,
                timeslotId: 2,
                title: "Встреча",
                username: "ivan",
                createdAt: 100,
            },
        ];

        dbMocks.selectExecute.mockResolvedValue(bookings);

        const result = await BookingService.findAll();

        expect(result).toEqual(bookings);
    });

    test("добавляет limit и offset", async () => {
        const bookingsQuery = {
            execute: dbMocks.selectExecute,
            limit: vi.fn(),
            offset: vi.fn(),
        };

        bookingsQuery.limit.mockReturnValue(bookingsQuery);
        bookingsQuery.offset.mockReturnValue(bookingsQuery);

        dbMocks.selectFrom.mockReturnValue({
            selectAll: vi.fn().mockReturnValue(bookingsQuery),
            innerJoin: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        execute: dbMocks.selectExecute,
                    }),
                }),
            }),
            select: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    execute: dbMocks.selectExecute,
                }),
            }),
        });

        await BookingService.findAll({ limit: 5, offset: 10 });

        expect(bookingsQuery.limit).toHaveBeenCalledWith(5);
        expect(bookingsQuery.offset).toHaveBeenCalledWith(10);
    });
});

describe("TimeslotService.findAll", () => {
    test("возвращает все слоты", async () => {
        const slots = [
            { id: 1, start: "10:00", end: "11:00" },
            { id: 2, start: "15:00", end: "16:00" },
        ];

        dbMocks.selectExecute.mockResolvedValue(slots);

        const result = await TimeslotService.findAll();

        expect(result).toEqual(slots);
    });

    test("фильтрует слоты AM", async () => {
        dbMocks.selectExecute.mockResolvedValue([
            { id: 1, start: "10:00", end: "11:00" },
            { id: 2, start: "12:00", end: "13:00" },
        ]);

        const result = await TimeslotService.findAll("AM");

        expect(result).toEqual([{ id: 1, start: "10:00", end: "11:00" }]);
    });

    test("фильтрует слоты PM", async () => {
        dbMocks.selectExecute.mockResolvedValue([
            { id: 1, start: "11:00", end: "12:00" },
            { id: 2, start: "15:00", end: "16:00" },
        ]);

        const result = await TimeslotService.findAll("PM");

        expect(result).toEqual([{ id: 2, start: "15:00", end: "16:00" }]);
    });
});
