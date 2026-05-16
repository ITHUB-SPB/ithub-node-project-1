import db from "../../database/connection.js";

export default class BookingService {
    static async findAll(params?: { limit?: number; offset?: number }) {
        let query = db.selectFrom("bookings").selectAll();

        if (params?.limit !== undefined) {
            query = query.limit(params.limit);
        }

        if (params?.offset !== undefined) {
            query = query.offset(params.offset);
        }

        return await query.execute();

        // return await db.selectFrom('bookings').selectAll().execute()
    }

    static async create(payload: { timeslotId: number; createdAt: number }) {
        return await db
            .insertInto("bookings")
            .values(payload)
            .returningAll()
            .executeTakeFirst();
    }

    static async delete(id: number) {
        await db.deleteFrom("bookings").where("id", "=", id).execute();
    }

    static async findByRoomId(roomId: number) {
        return await db
            .selectFrom("bookings")
            .innerJoin("timeslots", "timeslots.id", "bookings.timeslotId")
            .select([
                "bookings.id",
                "bookings.timeslotId",
                "bookings.areaId",
                "timeslots.start",
                "timeslots.end",
            ])
            .where("bookings.areaId", "=", roomId)
            .execute();
    }

    static async findBookedTimeslotIdsByRoom(
        roomId: number,
    ): Promise<number[]> {
        const rows = await db
            .selectFrom("bookings")
            .select(["timeslotId"])
            .where("areaId", "=", roomId)
            .execute();

        return rows.map((r) => Number(r.timeslotId));
    }
}
