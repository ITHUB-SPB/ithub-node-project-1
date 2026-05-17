import db from "../../database/connection.js";
import { type AreasQuerySchema } from "./area.schema.js";

export default class AreaService {
  static async findAll(queryParams: AreasQuerySchema) {
    let query = db.selectFrom("areas").selectAll();

    if (queryParams.capacity) {
      query = query.where("capacity", ">=", queryParams.capacity);
    }

    if (queryParams.filter?.length) {
      query = query.where("id", "in", queryParams.filter);
    }

    const areas = await query.orderBy("title").execute();

    const areasWithAmenities = await Promise.all(
      areas.map(async (area) => {
        const amenities = await db
          .selectFrom("amenities")
          .innerJoin("room_amenities", "amenities.id", "room_amenities.amenity_id")
          .where("room_amenities.room_id", "=", area.id)
          .select(["amenities.name", "amenities.label"])
          .execute();

        if (queryParams.amenities?.length) {
          const amenityNames = amenities.map(a => a.name);
          const hasAllAmenities = queryParams.amenities.every(a => amenityNames.includes(a));
          if (!hasAllAmenities) return null;
        }

        return { ...area, amenities };
      })
    );

    return areasWithAmenities.filter(Boolean);
  }

  static async findById(id: number) {
    const area = await db
      .selectFrom("areas")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!area) return null;

    const amenities = await db
      .selectFrom("amenities")
      .innerJoin("room_amenities", "amenities.id", "room_amenities.amenity_id")
      .where("room_amenities.room_id", "=", id)
      .select(["amenities.name", "amenities.label"])
      .execute();

    const bookings = await db
      .selectFrom("bookings")
      .innerJoin("timeslots", "bookings.timeslotId", "timeslots.id")
      .where("bookings.roomId", "=", id)
      .select(["timeslots.start", "timeslots.end"])
      .execute();

    return { ...area, amenities, bookings };
  }

  static async findAllForFilter() {
    return await db.selectFrom("areas").select(["id", "title"]).orderBy("title").execute();
  }
}