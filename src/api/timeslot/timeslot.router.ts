import TimeslotController from './timeslot.controller.js';

export const timeslotRoutes = [
    {
        method: 'GET',
        resource: '/timeslots',
        handler: TimeslotController.findAll,
    },
] as const;
