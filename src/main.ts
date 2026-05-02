import express, { type Request, type Response } from 'express';
import { engine } from 'express-handlebars';

import { areaRoutes } from './api/area/area.router.js'
import { bookingRoutes } from './api/booking/booking.router.js';
import { timeslotRoutes } from './api/timeslot/timeslot.router.js';

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', import.meta.dirname + '/views')

app.use('/public', express.static('public'))

app.use(express.json())

const rooms = [
    { id: 1, title: "A-101", capacity: '20-24' },
    { id: 2, title: "A-102", capacity: '10-14' },
    { id: 3, title: "B-200", capacity: '5-10' }
]

app.get('/', (request: Request, response: Response) => {
    // работать ajax-запросами
    response.render('partials/index', { rooms })
})

app.get('/rooms/:roomId', (request: Request, response: Response) => {
    const roomId = request.params["roomId"]
    const room = rooms.find(room => room.id === Number(roomId))

    // работать классически
    response.render('partials/detail', { room })
})

app.get('/booking/:roomId', (request: Request, response: Response) => {
    const roomId = request.params["roomId"]
    const room = rooms.find(room => room.id === Number(roomId))

    // работать классически
    response.render('partials/booking', { room })
})

app.use('/api/areas', areaRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/timeslots', timeslotRoutes)

app.get('/api/health', (_, response) => {
    return response.json({
        status: "OK"
    })
})

app.listen(3000, () => {
    console.log(`App listening: http://localhost:3000/`);
    console.log(`API listening: http://localhost:3000/api/`);
});