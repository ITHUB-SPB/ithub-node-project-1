import express from 'express';

// import { bookingRoutes } from './booking/booking.router.js';
import { areaRoutes } from './area/area.router.js'


const app = express()

app.use(express.json())

app.use('/areas', areaRoutes)

app.get('/health', (_, response) => {
    return response.json({
        status: "OK"
    })
})

app.listen(3000, () => {
    console.log(`API server listening: http://localhost:3000`);
});
