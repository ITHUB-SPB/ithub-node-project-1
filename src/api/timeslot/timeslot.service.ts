import type { Kysely } from "kysely";
import type { Database } from "../../database/interface.js";
import type { Params } from "../lib/schema.js";
import { Timeslot } from "./timeslot.model.js";

export default class TimeslotService {
  static findAll(params: { pathParams: { id: number; } | null; queryParams: { limit?: number | undefined; offset?: number | undefined; filter?: string | undefined; sort?: string | undefined; }; }) {
    throw new Error("Method not implemented.");
  }
  constructor(private db: Kysely<Database>) {}

  async findAll(params: Params) {
    const filter = params.queryParams.filter?.toLowerCase();

    const rows = await this.db
      .selectFrom("timeslots")
      .selectAll()
      .orderBy("start", "asc")
      .execute();

    let result = rows.map((row) => {
      const slot = Timeslot.fromMapped({ start: row.start, end: row.end });

      return {
        id: row.id,
        start: slot.start.toISOString(),
        end: slot.end.toISOString(),
        am: slot.am,
        pm: slot.pm,
      };
    });

    if (filter === "am") {
      result = result.filter((t) => t.am);
    } else if (filter === "pm") {
      result = result.filter((t) => t.pm);
    }

    return result;
  }
}