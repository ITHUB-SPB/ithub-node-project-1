import BookingController from './booking.controller.js';

export const bookingRoutes = [
    {
        method: 'GET',
        resource: '/bookings',
        handler: BookingController.findAll,
    },
    {
        method: 'POST',
        resource: '/bookings',
        handler: BookingController.create,
    },
    {
        method: 'DELETE',
        resource: '/bookings',
        handler: BookingController.delete,
    },
];
