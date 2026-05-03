import TimeslotController from './timeslot.controller.js';
import { Router } from 'express';


const router = Router();

router.get('/timeslots', TimeslotController.findAll);
export default router;