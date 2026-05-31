import { assert, test, describe, beforeEach } from 'vitest';
import { Router } from '../src/lib/router';

describe('регистрация паттернов', () => {
    test('добавление нового паттерна', () => {
        const router = new Router();
        const handler = () => ({ status: 200 });
        
        router.register('GET', '/api/areas', handler);
        
        const result = router.route('GET', '/api/areas');
        assert.equal(result.handler, handler);
    });

    test('обновление существующего паттерна', () => {
        const router = new Router();
        const oldHandler = () => ({ status: 200 });
        const newHandler = () => ({ status: 201 });
        
        router.register('GET', '/api/areas', oldHandler);
        router.register('GET', '/api/areas', newHandler);
        
        const result = router.route('GET', '/api/areas');
        assert.equal(result.handler, newHandler);
    });
});

describe('роутинг запросов', () => {
    test('возвращается соответствующий обработчик', () => {
        const router = new Router();
        const areasHandler = () => ({ resource: 'areas' });
        const bookingsHandler = () => ({ resource: 'bookings' });
        
        router.register('GET', '/api/areas', areasHandler);
        router.register('GET', '/api/bookings', bookingsHandler);
        
        const areasResult = router.route('GET', '/api/areas');
        const bookingsResult = router.route('GET', '/api/bookings');
        
        assert.equal(areasResult.handler, areasHandler);
        assert.equal(bookingsResult.handler, bookingsHandler);
    });

    test('404 при отсутствии обработчика', () => {
        const router = new Router();
        
        const result = router.route('GET', '/api/unknown');
        
        assert.isNull(result.handler);
        assert.equal(result.statusCode, 404);
    });
    
    test('обрабатывает параметры пути', () => {
        const router = new Router();
        const handler = (params) => ({ id: params.pathParams.id });
        
        router.register('GET', '/api/areas/:id', handler);
        
        const result = router.route('GET', '/api/areas/42');
        
        assert.equal(result.params.pathParams.id, 42);
    });
    
    test('обрабатывает query параметры', () => {
        const router = new Router();
        const handler = (params) => params.queryParams;
        
        router.register('GET', '/api/areas', handler);
        
        const result = router.route('GET', '/api/areas?limit=10&offset=5');
        
        assert.equal(result.params.queryParams.limit, '10');
        assert.equal(result.params.queryParams.offset, '5');
    });
});