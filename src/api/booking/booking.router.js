import { Router } from 'express';
import BookingController from './booking.controller.js';

const router = Router();

router.get('/bookings', BookingController.find);
router.post('/bookings', BookingController.create);
router.delete('/bookings', BookingController.delete);

export default router;