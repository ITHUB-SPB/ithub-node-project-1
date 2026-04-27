import { Router } from 'express';
import AreaController from './area.controller.js';

export const areaRoutes = Router({ mergeParams: true })

areaRoutes.get('/', AreaController.findAll)
