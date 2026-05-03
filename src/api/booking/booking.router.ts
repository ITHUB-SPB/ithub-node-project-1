import { Router } from 'express';
import BookingController from './booking.controller.js';

const router = Router();

router.get('/', BookingController.find);
router.post('/', BookingController.create);
router.delete('/:id', BookingController.delete);

export { router as bookingRouter };