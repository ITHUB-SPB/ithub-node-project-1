import AreaController from './area.controller.js';

export const areaRoutes = [
    {
        method: 'GET',
        resource: '/areas',
        handler: AreaController.findAll,
    }
] as const;
