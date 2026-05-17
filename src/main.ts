import express from 'express';
import type { Request, Response } from 'express';
import { engine } from 'express-handlebars';

import { areaRoutes } from './api/area/area.router.js';
import { bookingRoutes } from './api/booking/booking.router.js';
import { timeslotRoutes } from './api/timeslot/timeslot.router.js';

type Booking = {
  id: number;
  title: string;
  organizer: string;
  start: string;
  end: string;
  time: string;
};

type Room = {
  id: number;
  title: string;
  city: string;
  location: string;
  capacity: string;
  wifi: string;
  hasTv: string;
  hasBoard: string;
  image: string;
  detailImage: string;
  bookings: Booking[];
};

type RoomFilters = {
  room: string[];
  device: string[];
  capacity: string;
  from: string;
  to: string;
};

type BookingForm = {
  title?: string;
  organizer?: string;
  start?: string;
  end?: string;
};

function asArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [String(value)];
}

function getString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return '';
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isTimeCorrect(start: string, end: string): boolean {
  return timeToMinutes(start) < timeToMinutes(end);
}

function isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}

function getMaxCapacity(capacity: string): number {
  const numbers = capacity.match(/\d+/g)?.map(Number) || [];
  return numbers.length > 0 ? Math.max(...numbers) : 0;
}

class AreaService {
  constructor(private rooms: Room[]) {}

  findAll(filters?: RoomFilters): Room[] {
    if (!filters) {
      return this.rooms;
    }

    return this.rooms.filter((room) => {
      if (filters.room.length > 0 && !filters.room.includes(room.title)) {
        return false;
      }

      if (filters.device.includes('tv') && room.hasTv.toLowerCase() !== 'yes') {
        return false;
      }

      if (filters.device.includes('board') && room.hasBoard.toLowerCase() !== 'yes') {
        return false;
      }

      if (filters.device.includes('wifi') && room.wifi.toLowerCase() === 'no') {
        return false;
      }

      if (filters.capacity) {
        const neededCapacity = Number(filters.capacity);
        const roomMaxCapacity = getMaxCapacity(room.capacity);

        if (!Number.isNaN(neededCapacity) && neededCapacity > roomMaxCapacity) {
          return false;
        }
      }

      if (filters.from && filters.to) {
        if (!isTimeCorrect(filters.from, filters.to)) {
          return false;
        }

        if (!this.isRoomAvailable(room, filters.from, filters.to)) {
          return false;
        }
      }

      return true;
    });
  }

  findById(id: number): Room | undefined {
    return this.rooms.find((room) => room.id === id);
  }

  addBooking(roomId: number, form: BookingForm): { success: boolean; errors: string[] } {
    const room = this.findById(roomId);
    const errors: string[] = [];

    if (!room) {
      errors.push('Комната не найдена');
      return { success: false, errors };
    }

    const title = form.title?.trim() || '';
    const organizer = form.organizer?.trim() || '';
    const start = form.start || '';
    const end = form.end || '';

    if (title.length < 2) {
      errors.push('Тема бронирования должна быть не короче 2 символов');
    }

    if (organizer.length < 2) {
      errors.push('Имя организатора должно быть не короче 2 символов');
    }

    if (!start || !end) {
      errors.push('Укажите время начала и окончания бронирования');
    }

    if (start && end && !isTimeCorrect(start, end)) {
      errors.push('Время окончания должно быть позже времени начала');
    }

    if (start && end && !this.isRoomAvailable(room, start, end)) {
      errors.push('Этот слот уже занят. Выберите другое время');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    room.bookings.push({
      id: room.bookings.length + 1,
      title,
      organizer,
      start,
      end,
      time: `${start} - ${end}`,
    });

    return { success: true, errors: [] };
  }

  getAvailableSlots(roomId: number): { start: string; end: string }[] {
    const room = this.findById(roomId);

    if (!room) {
      return [];
    }

    const allSlots = [
      { start: '09:00', end: '09:30' },
      { start: '09:30', end: '10:00' },
      { start: '10:00', end: '10:30' },
      { start: '10:30', end: '11:00' },
      { start: '11:00', end: '11:30' },
      { start: '11:30', end: '12:00' },
      { start: '12:00', end: '12:30' },
      { start: '12:30', end: '13:00' },
      { start: '13:00', end: '13:30' },
      { start: '13:30', end: '14:00' },
      { start: '14:00', end: '14:30' },
      { start: '14:30', end: '15:00' },
      { start: '15:00', end: '15:30' },
      { start: '15:30', end: '16:00' },
      { start: '16:00', end: '16:30' },
      { start: '16:30', end: '17:00' },
      { start: '17:00', end: '17:30' },
      { start: '17:30', end: '18:00' },
    ];

    return allSlots.filter((slot) => this.isRoomAvailable(room, slot.start, slot.end));
  }

  private isRoomAvailable(room: Room, start: string, end: string): boolean {
    return !room.bookings.some((booking) => {
      return isTimeOverlapping(start, end, booking.start, booking.end);
    });
  }
}

const app = express();

app.engine(
  'handlebars',
  engine({
    helpers: {
      checked(value: string, selected: unknown) {
        const selectedValues = asArray(selected);
        return selectedValues.includes(value) ? 'checked' : '';
      },
    },
  }),
);

app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const roomImages = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
];

const rooms: Room[] = Array.from({ length: 24 }, (_, index) => {
  const names = [
    'A-101',
    'A-102',
    'B-140',
    'Austin',
    'Boston',
    'Chicago',
    'Denver',
    'Seattle',
  ];

  return {
    id: index + 1,
    title: names[index % names.length],
    city: 'Dev Bay',
    location: 'Dev Bay, Chennai',
    capacity: index % 3 === 0 ? '20-24' : index % 3 === 1 ? '10-14' : '5-10',
    wifi: index % 4 === 0 ? 'No' : 'Sirius Guest',
    hasTv: index % 2 === 0 ? 'yes' : 'No',
    hasBoard: index % 3 === 0 ? 'yes' : 'No',
    image: roomImages[index % roomImages.length],
    detailImage: roomImages[(index + 1) % roomImages.length],
    bookings: [
      {
        id: 1,
        title: 'React Review',
        organizer: 'Nijin',
        start: '10:00',
        end: '10:30',
        time: '10:00 - 10:30',
      },
      {
        id: 2,
        title: 'Project Meeting',
        organizer: 'Islam',
        start: '12:00',
        end: '12:30',
        time: '12:00 - 12:30',
      },
    ],
  };
});

rooms.push({
  id: rooms.length + 1,
  title: 'C-205',
  city: 'Dev Bay',
  location: 'Dev Bay, Chennai',
  capacity: '15-20',
  wifi: 'Sirius Guest',
  hasTv: 'yes',
  hasBoard: 'yes',
  image: '/public/images/205.png',
  detailImage: '/public/images/205.png',
  bookings: [
    {
      id: 1,
      title: 'Node.js Meeting',
      organizer: 'Islam',
      start: '12:00',
      end: '12:30',
      time: '12:00 - 12:30',
    },
  ],
});

const areaService = new AreaService(rooms);

app.get('/', (request: Request, response: Response) => {
  const filters: RoomFilters = {
    room: asArray(request.query.room),
    device: asArray(request.query.device),
    capacity: getString(request.query.capacity),
    from: getString(request.query.from),
    to: getString(request.query.to),
  };

  const filteredRooms = areaService.findAll(filters);

  response.render('index', {
    rooms: filteredRooms,
    total: filteredRooms.length,
    hasRooms: filteredRooms.length > 0,
    filters,
  });
});

app.get('/rooms/:roomId', (request: Request, response: Response) => {
  const roomId = Number(request.params['roomId']);
  const room = areaService.findById(roomId);

  if (!room) {
    response.status(404).send('Комната не найдена');
    return;
  }

  response.render('detail', { room });
});

app.get('/booking/:roomId', (request: Request, response: Response) => {
  const roomId = Number(request.params['roomId']);
  const room = areaService.findById(roomId);

  if (!room) {
    response.status(404).send('Комната не найдена');
    return;
  }

  response.render('booking', {
    room,
    errors: [],
    form: {},
  });
});

app.post('/booking/:roomId', (request: Request, response: Response) => {
  const roomId = Number(request.params['roomId']);
  const room = areaService.findById(roomId);

  if (!room) {
    response.status(404).send('Комната не найдена');
    return;
  }

  const form = request.body as BookingForm;
  const result = areaService.addBooking(roomId, form);

  if (!result.success) {
    response.status(400).render('booking', {
      room,
      errors: result.errors,
      form,
    });

    return;
  }

  response.redirect(`/rooms/${room.id}`);
});

app.get('/api/rooms/:roomId/available-slots', (request: Request, response: Response) => {
  const roomId = Number(request.params['roomId']);
  const room = areaService.findById(roomId);

  if (!room) {
    response.status(404).json({
      error: 'Комната не найдена',
    });

    return;
  }

  response.json({
    roomId: room.id,
    slots: areaService.getAvailableSlots(room.id),
  });
});

/*
 API ROUTES
*/

app.use('/api/areas', areaRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (_, response) => {
  return response.json({
    status: 'OK',
  });
});

app.listen(3000, () => {
  console.log('App listening: http://localhost:3000/');
  console.log('API listening: http://localhost:3000/api/');
});