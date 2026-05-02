import { Router } from 'express';
import TimeslotController from './timeslot.controller.js';

export const timeslotRoutes = Router({ mergeParams: true })

timeslotRoutes.get('/', TimeslotController.findAll)
