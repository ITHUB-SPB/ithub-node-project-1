import { Router } from 'express';
import BookingController from './booking.controller.js';

const router = Router();

router.get('/bookings', BookingController.findAll);
router.post('/bookings', BookingController.create);
router.delete("/bookings/:id", BookingController.delete);

export default router;