import { Router } from 'express';
import BookingController from './booking.controller.js';

export const bookingRoutes = Router({ mergeParams: true })

bookingRoutes.get('/', BookingController.find)
bookingRoutes.post('/', BookingController.create)
bookingRoutes.delete('/:id', BookingController.delete)
