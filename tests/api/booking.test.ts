import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/main.js';
import db from '../../src/database/connection.js';
import { createTables } from '../../src/database/cli/ddl.js';
import seedTables from '../../src/database/cli/seed.js';
import BookingService from '../../src/api/booking/booking.service.js';

describe('Booking API', () => {
  beforeAll(async () => {
    await createTables(true);
    await seedTables([]);
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('GET /api/bookings', () => {
    it('должен вернуть список бронирований с кодом 200', async () => {
      const response = await request(app).get('/api/bookings').expect(200);
      expect(response.body).toHaveProperty('bookings');
      expect(Array.isArray(response.body.bookings)).toBe(true);
    });

    it('должен возвращать массив (даже если пустой)', async () => {
      const existing = await BookingService.findAll();
      for (const b of existing) {
        await BookingService.delete(b.id);
      }
      const response = await request(app).get('/api/bookings').expect(200);
      expect(response.body.bookings).toEqual([]);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    let testBookingId: number;

    beforeEach(async () => {
      const booking = await BookingService.create({
        timeslotId: 1,
        createdAt: Math.floor(Date.now() / 1000),
      });
      testBookingId = booking!.id;
    });

    it('должен удалить существующее бронирование и вернуть 204', async () => {
      await request(app).delete(`/api/bookings/${testBookingId}`).expect(204);
      const all = await BookingService.findAll();
      expect(all.find(b => b.id === testBookingId)).toBeUndefined();
    });

    it('должен вернуть 400 при нечисловом id', async () => {
      const response = await request(app).delete('/api/bookings/abc').expect(400);
      expect(response.body.error).toBeDefined();
    });

    it('должен вернуть 400 при id = 0 или отрицательном', async () => {
      const response = await request(app).delete('/api/bookings/0').expect(400);
      expect(response.body.error).toMatch(/положительное/i);
    });

    it('должен вернуть 204 при попытке удалить несуществующую запись', async () => {
      await request(app).delete('/api/bookings/999999').expect(204);
    });
  });
});