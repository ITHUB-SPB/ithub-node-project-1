import { Timeslot } from './timeslot.model.js';
import connection from '../database/connection.js'


export default class TimeslotService {
    static findAll(filter?: 'AM' | 'PM') {
        const statement = connection.prepare('SELECT * FROM timeslots');
        const rows = statement.all();

        let slots = rows.map(
            (r: any) => new Timeslot(new Date(r.start), new Date(r.end))
        );

        if (filter === 'AM') {
            slots = slots.filter(s => s.isAM);
        }
        
        if (filter === 'PM') {
            slots = slots.filter(s => s.isPM);
        }

        return slots;
    }
}
