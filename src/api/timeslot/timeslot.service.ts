import * as v from 'valibot';
import db from '../../database/connection.js';
import { Timeslot } from './timeslot.model.js';
import { timeslotsSchema, type TimeslotsQuerySchema } from './timeslot.schema.js';

function timeToDate(time: string) {
  return new Date(`2000-01-01T${time}:00`);
}

export default class TimeslotService {
  static async findAll(queryParams: TimeslotsQuerySchema) {
    const rows = await db
      .selectFrom('timeslots')
      .selectAll()
      .orderBy('start')
      .execute();

    let items = rows.map((row) => ({
      row,
      model: new Timeslot(timeToDate(row.start), timeToDate(row.end)),
    }));

    if (queryParams.part === 'AM') {
      items = items.filter((item) => item.model.AM);
    }

    if (queryParams.part === 'PM') {
      items = items.filter((item) => item.model.PM);
    }

    return v.parse(
      timeslotsSchema,
      items.map((item) => item.row),
    );
  }
}
