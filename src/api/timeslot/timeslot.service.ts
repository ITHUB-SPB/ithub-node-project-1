import db from "../../database/connection.js";

export default class TimeslotService {
  static async findAll(filter?: "AM" | "PM") {
    let query = db.selectFrom("timeslots").selectAll();

    const rows = await query.execute();

    let slots = rows;

    if (filter === "AM") {
      slots = slots.filter((s: any) => new Date(s.start).getHours() < 12);
    }

    if (filter === "PM") {
      slots = slots.filter((s: any) => new Date(s.start).getHours() >= 12);
    }

    return slots;
  }
}
