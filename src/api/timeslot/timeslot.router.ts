import { Router } from 'express';
import TimeslotController from './timeslot.controller.js';

const router = Router();

router.get('/', TimeslotController.findAll);

export { router as timeslotRouter };