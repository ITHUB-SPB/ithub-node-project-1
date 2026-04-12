import * as v from 'valibot';

import { Timeslot } from './timeslot.model.js';
import * as schema from './timeslot.schema.js';
import connection from '../database/connection.js';

export default class TimeslotService {
    static async findAll(queryParams: any) {
        // 1. Получаем все существующие временные слоты независимо от фильтрации
        const [rows] = await connection.query('SELECT * FROM timeslots');
        
        // 2. Трансформируем в экземпляры модели
        let timeslots = (rows as any[]).map((row) => 
            Timeslot.fromMapped({ 
                id: row.id, 
                start: row.start, 
                end: row.end 
            })
        );

        // 3. Фильтруем массив моделей по предикату (через геттеры AM / PM)
        if (queryParams?.filter === 'AM') {
            timeslots = timeslots.filter(slot => slot.AM);
        } else if (queryParams?.filter === 'PM') {
            timeslots = timeslots.filter(slot => slot.PM);
        }

        // 4. Мапим обратно в обычные объекты и валидируем по схеме
        const responseData = timeslots.map(slot => slot.toMapped());

        return v.parse(schema.timeslotsSchema, responseData);
    }
}