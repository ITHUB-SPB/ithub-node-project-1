const bookings: Array<{
    id: number;
    start: number;
    end: number;
    createdAt: number;
}> = [];
let nextBookingId = 1;

export default class BookingService {
    static findAll() {
        return bookings;
    }

    static create(payload: {
        start: number;
        end: number;
        createdAt: number;
    }) {
        const createdBooking = {
            id: nextBookingId++,
            start: payload.start,
            end: payload.end,
            createdAt: payload.createdAt,
        };

        bookings.push(createdBooking);

        return createdBooking;
    }

    static delete(idToDelete: number) {
        const indexToDelete = bookings.findIndex(
            (booking) => booking.id === idToDelete,
        );

        if (indexToDelete === -1) {
            throw new Error(`Record with id ${idToDelete} not found`);
        }

        bookings.splice(indexToDelete, 1);
    }
}
