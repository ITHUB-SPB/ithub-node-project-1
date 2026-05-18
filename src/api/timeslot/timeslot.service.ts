import * as v from "valibot";
import db from "../../database/connection.js";
import { timeslotListSchema, type TimeslotList, type TimeslotFilters } from "./timeslot.schema.js";
import { Timeslot } from "./timeslot.model.js";

export default class TimeslotService {
  static async getAll(): Promise<TimeslotList> {
    const slots = await db.selectFrom("timeslots").selectAll().execute();
    return v.parse(timeslotListSchema, slots);
  }

  static async filterByTimeRange(filters: TimeslotFilters): Promise<TimeslotList> {
    let query = db.selectFrom("timeslots").selectAll();

    if (filters.startTime) {
      query = query.where("start", ">=", filters.startTime);
    }
    if (filters.endTime) {
      query = query.where("end", "<=", filters.endTime);
    }

    let slots = await query.execute();
    let validated = v.parse(timeslotListSchema, slots);

    if (filters.period) {
      validated = validated.filter((slot) => {
        const model = new Timeslot(new Date(slot.start), new Date(slot.end));
        return filters.period === "am" ? model.isMorning : model.isAfternoon;
      });
    }

    return validated;
  }
}