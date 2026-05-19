import { db } from '../../database/connection.js'
import { Timeslot } from './timeslot.model.js'

type QueryParams = {
    timeOfDay?: string | undefined
}

export default class TimeslotService {
    static async findAll(queryParams: QueryParams = {}) {
        const statement = db.selectFrom('timeslots').selectAll().orderBy('timeslots.start')

        const timeslots = await statement.execute()
        const instances = timeslots.map(slot => new Timeslot(new Date(slot.start), new Date(slot.end)))

        if (queryParams.timeOfDay) {
            if (queryParams.timeOfDay === 'AM') {
                return instances.filter(slot => slot.AM)
            } else if (queryParams.timeOfDay === 'PM') {
                return instances.filter(slot => slot.PM)
            }
        }

        return instances
    }
}
