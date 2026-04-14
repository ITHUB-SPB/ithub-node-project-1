import { createServer } from "node:http";

import Router from "./lib/router.js";
import { RequestParser } from "./lib/requestParser.js";

import { bookingRoutes } from "./booking/booking.router.js";
import { areaRoutes } from "./area/area.router.js";
import { timeslotRoutes } from "./timeslot/timeslot.router.js";

const router = new Router();

const allRoutes = [...areaRoutes, ...timeslotRoutes, ...bookingRoutes];

for (const route of allRoutes) {
  router.register(
    { method: route.method, resource: route.resource },
    route.handler as any,
  );
}

const server = createServer(async (request, response) => {
  try {
    const requestParser = new RequestParser(request);
    const { method, resource, params, payload } =
      await requestParser.toObject();

    const handler = router.handle({ method, resource });

    if (!handler) {
      response.writeHead(404);
      return response.end(JSON.stringify({ error: "Route not found" }));
    }

    const { statusCode, data } = handler({ params, payload });

    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  } catch (error: any) {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        error: "Bad Request",
        details: error.issues || error.message,
      }),
    );
  }
});

server.listen(3000, () => {
  console.log(`API server listening: http://localhost:3000`);
});