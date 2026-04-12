import * as v from "valibot";

import connection from "../database/connection.js";
import { Timeslot } from "./timeslot.model.js";
import * as schema from "./timeslot.schema.js";
import type { Params } from "../lib/schema.js";

export default class TimeslotService {
  static findAll(params: Params): schema.TimeslotsSchema {
    const filter = params.queryParams.filter?.toLowerCase(); 


    const statement = connection.prepare(
      "SELECT * FROM timeslots ORDER BY startTime",
    );
    const rows = statement.all() as any[];

    const timeslotInstances = rows.map((row) => {
      const instance = new Timeslot(
        new Date(row.startTime),
        new Date(row.endTime),
      );
      return {
        instance,
        id: row.id,
        areaId: row.areaId,
      };
    });

    let filtered = timeslotInstances;
    if (filter === "am") {
      filtered = timeslotInstances.filter((item) => item.instance.am);
    } else if (filter === "pm") {
      filtered = timeslotInstances.filter((item) => item.instance.pm);
    }

    const result = filtered.map((item) => ({
      id: item.id,
      areaId: item.areaId,
      start: item.instance.start.toISOString(),
      end: item.instance.end.toISOString(),
      am: item.instance.am,
      pm: item.instance.pm,
    }));

    return v.parse(schema.timeslotsSchema, result);
  }
}
