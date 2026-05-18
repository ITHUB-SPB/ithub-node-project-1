import db from "../../database/connection.js";

export default class TimeslotService {
  static async findAll(filter?: "AM" | "PM") {
    const rows = await db.selectFrom("timeslots").selectAll().execute();
    let slots = rows;
    
    if (filter === "AM") {
      slots = slots.filter((s: any) => {
        const hour = parseInt(s.start.split(':')[0]);
        return hour < 12;
      });
    }
    if (filter === "PM") {
      slots = slots.filter((s: any) => {
        const hour = parseInt(s.start.split(':')[0]);
        return hour >= 12;
      });
    }
    return slots;
  }

  static async findFreeByRoom(roomId: number) {
    const allSlots = await db.selectFrom("timeslots").selectAll().execute();
    const bookedSlots = await db
      .selectFrom("bookings")
      .where("roomId", "=", roomId)
      .select("timeslotId")
      .execute();
    const bookedIds = new Set(bookedSlots.map(b => b.timeslotId));
    return allSlots.filter(slot => !bookedIds.has(slot.id));
  }
}