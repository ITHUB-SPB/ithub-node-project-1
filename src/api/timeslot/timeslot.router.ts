
import { Router } from 'express';
import TimeslotController from './timeslot.controller.js';

const router = Router();

router.get('/timeslots', TimeslotController.findAll);

export default router;