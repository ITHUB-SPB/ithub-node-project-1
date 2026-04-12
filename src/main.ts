import { createServer } from 'node:http';

import Router from './lib/router.js'
import { RequestParser } from './lib/requestParser.js';

import { bookingRoutes } from './booking/booking.router.js';
import { areaRoutes } from './area/area.router.js'
import { timeslotRoutes } from './timeslot/timeslot.router.js'

const router = new Router();
for (const { method, resource, handler } of [
    ...areaRoutes,
    ...timeslotRoutes,
    ...bookingRoutes,
]) {
    router.register({ method, resource }, handler);
}

const server = createServer(async (request, response) => {
    const requestParser = new RequestParser(request)

    const { method, resource, params, payload } = await requestParser.toObject();

    const { statusCode, data } = router.handle({ method, resource })({
        params,
        payload,
    });

    response.writeHead(statusCode, undefined, {
        'Content-Type': 'application/json',
    });

    response.end(JSON.stringify(data));
});

server.listen(3000, () => {
    console.log(`API server listening: http://localhost:3000`);
});
