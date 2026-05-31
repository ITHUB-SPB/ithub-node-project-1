import { assert, test, describe, beforeEach } from 'vitest';
import { RequestParser } from '../src/lib/requestParser';

describe('парсинг ресурса', () => {
    test('работает для простых адресов', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.equal(result.resource, '/areas');
    });

    test('работает для адресов с параметром пути', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas/5', {}, {});
        
        assert.equal(result.resource, '/areas');
        assert.equal(result.params.pathParams.id, 5);
    });
});

describe('парсинг метода', () => {
    test('распознает метод GET', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.equal(result.method, 'GET');
    });

    test('распознает метод POST', () => {
        const parser = new RequestParser();
        const result = parser.parse('POST', '/api/bookings', {}, {});
        
        assert.equal(result.method, 'POST');
    });

    test('распознает метод DELETE', () => {
        const parser = new RequestParser();
        const result = parser.parse('DELETE', '/api/bookings/5', {}, {});
        
        assert.equal(result.method, 'DELETE');
    });
});

describe('парсинг тела', () => {
    test('возвращает null для запросов с методами GET и DELETE', () => {
        const parser = new RequestParser();
        
        const getResult = parser.parse('GET', '/api/areas', { title: 'test' }, {});
        assert.isNull(getResult.payload);
        
        const deleteResult = parser.parse('DELETE', '/api/bookings/5', { title: 'test' }, {});
        assert.isNull(deleteResult.payload);
    });

    test('считывает тело в POST-запросах', () => {
        const parser = new RequestParser();
        const payload = { title: 'Мероприятие', username: 'Иван', timeslotId: 2 };
        
        const result = parser.parse('POST', '/api/bookings', payload, {});
        
        assert.deepEqual(result.payload, payload);
    });
});

describe('парсинг параметров пути', () => {
    test('распознает параметры пути', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas/42', {}, {});
        
        assert.equal(result.params.pathParams.id, 42);
    });

    test('возвращает null при отсутствии параметров пути', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.isNull(result.params.pathParams);
    });
});

describe('парсинг поискового параметра filter', () => {
    test('распознает параметр поиска filter', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas?filter=1,2,3', {}, {});
        
        assert.equal(result.params.queryParams.filter, '1,2,3');
    });

    test('возвращает null при отсутствии параметра', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.isUndefined(result.params.queryParams.filter);
    });
});

describe('парсинг поискового параметра sort', () => {
    test('распознает параметр поиска sort', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas?sort=title', {}, {});
        
        assert.equal(result.params.queryParams.sort, 'title');
    });

    test('возвращает null при отсутствии параметра', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.isUndefined(result.params.queryParams.sort);
    });
});

describe('парсинг поискового параметра offset', () => {
    test('распознает параметр поиска offset', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas?offset=10', {}, {});
        
        assert.equal(result.params.queryParams.offset, '10');
    });

    test('возвращает null при отсутствии параметра', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.isUndefined(result.params.queryParams.offset);
    });
});

describe('парсинг поискового параметра limit', () => {
    test('распознает параметр поиска limit', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas?limit=20', {}, {});
        
        assert.equal(result.params.queryParams.limit, '20');
    });

    test('возвращает null при отсутствии параметра', () => {
        const parser = new RequestParser();
        const result = parser.parse('GET', '/api/areas', {}, {});
        
        assert.isUndefined(result.params.queryParams.limit);
    });
});