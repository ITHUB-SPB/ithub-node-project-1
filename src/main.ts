import express from 'express';
import { areaRoutes } from './api/area/area.router.js';
import { bookingRouter } from './api/booking/booking.router.js';
import { timeslotRouter } from './api/timeslot/timeslot.router.js';

const app = express();
app.use(express.json());

app.use('/areas', areaRoutes);
app.use('/bookings', bookingRouter);
app.use('/timeslots', timeslotRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

export default app;