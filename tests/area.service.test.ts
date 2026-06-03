import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import db from '../src/database/connection.js';
import { createTables } from '../src/database/cli/ddl.js';
import seedTables from '../src/database/cli/seed.js';
import AreaService from '../src/api/area/area.service.js';

describe('AreaService', () => {
  beforeAll(async () => {
    await createTables(true);
    await seedTables([]);
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('findAll', () => {
    it('должен вернуть все помещения без пагинации', async () => {
      const result = await AreaService.findAll({});
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('title');
    });

    it('должен поддерживать limit и offset', async () => {
      const limit = 3;
      const offset = 1;
      const all = await AreaService.findAll({});
      const sliced = all.slice(offset, offset + limit);
      const result = await AreaService.findAll({ limit, offset });
      expect(result).toHaveLength(limit);
      expect(result).toEqual(sliced);
    });

    it('должен фильтровать по capacity (>=)', async () => {
      const capacity = 10;
      const result = await AreaService.findAll({ capacity });
      for (const room of result) {
        expect(room.capacity).toBeGreaterThanOrEqual(capacity);
      }
    });

    it('должен фильтровать по wifi=1', async () => {
      const result = await AreaService.findAll({ wifi: '1' });
      for (const room of result) {
        expect(room.wifi).toBe(1);
      }
    });

    it('должен фильтровать по board=1', async () => {
      const result = await AreaService.findAll({ board: '1' });
      for (const room of result) {
        expect(room.board).toBe(1);
      }
    });

    it('должен фильтровать по plasma=1', async () => {
      const result = await AreaService.findAll({ plasma: '1' });
      for (const room of result) {
        expect(room.plasma).toBe(1);
      }
    });

    it('должен фильтровать по списку id (filter)', async () => {
      const all = await AreaService.findAll({});
      const ids = [all[0].id, all[1].id];
      const filter = ids.map(String);
      const result = await AreaService.findAll({ filter });
      expect(result).toHaveLength(ids.length);
      expect(result.map(r => r.id)).toEqual(expect.arrayContaining(ids));
    });
  });

  describe('findById', () => {
    it('должен вернуть комнату по существующему id', async () => {
      const all = await AreaService.findAll({});
      const first = all[0];
      const found = await AreaService.findById(first.id);
      expect(found).toEqual(first);
    });

    it('должен выбросить ошибку для несуществующего id', async () => {
      await expect(AreaService.findById(99999)).rejects.toThrow('Комната не найдена');
    });
  });
});