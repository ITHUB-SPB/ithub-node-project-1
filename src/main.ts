import express, { type Request, type Response } from "express";
import { engine } from "express-handlebars";

import { areaRoutes } from "./api/area/area.router.js";
import { bookingRoutes } from "./api/booking/booking.router.js";
import { timeslotRoutes } from "./api/timeslot/timeslot.router.js";
import AreaService from "./api/area/area.service.js";

const app = express();

app.engine(
  "handlebars",
  engine({
    helpers: {
      includes: (value: string, array: string[] | number[] | undefined) => {
        if (!array) return false;
        const strValue = String(value);
        return array.some(item => String(item) === strValue);
      },
      toString: (value: number) => String(value),
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", import.meta.dirname + "/views");

app.use("/public", express.static("public"));

app.use(express.json());

app.get("/", async (request: Request, response: Response) => {
  const capacity = request.query.capacity as string | undefined;
  const amenities = request.query.amenities as string | undefined;
  const filter = request.query.filter as string | undefined;

  const rooms = await AreaService.findAll({
    capacity: capacity ? Number(capacity) : undefined,
    amenities: amenities?.split(","),
    filter: filter?.split(",").map(Number),
  });

  const allRoomsForFilter = await AreaService.findAllForFilter();

  response.render("index", {
    rooms,
    allRoomsForFilter,
    filters: { 
      capacity, 
      amenities: amenities?.split(",") || [],
      filter: filter?.split(",").map(Number) || []
    },
  });
});

app.get("/details/:roomId", async (request: Request, response: Response) => {
  const roomId = Number(request.params["roomId"]);
  const room = await AreaService.findById(roomId);

  if (!room) {
    return response.status(404).send("Комната не найдена");
  }

  response.render("detail", { room });
});

app.get("/booking/:roomId", async (request: Request, response: Response) => {
  const roomId = Number(request.params["roomId"]);
  const room = await AreaService.findById(roomId);

  if (!room) {
    return response.status(404).send("Комната не найдена");
  }

  response.render("booking", { room });
});

app.use("/api/areas", areaRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/timeslots", timeslotRoutes);

app.get("/api", (_, response) => {
  return response.json({
    status: "OK",
  });
});

app.engine(
  "handlebars",
  engine({
    helpers: {
      includes: (value: string, array: string[] | number[] | undefined) => {
        if (!array) return false;
        const strValue = String(value);
        return array.some(item => String(item) === strValue);
      },
      eq: (a: any, b: any) => a === b,
    },
  })
);

app.listen(3000, () => {
  console.log(`App listening: http://localhost:3000/`);
  console.log(`API listening: http://localhost:3000/api/`);
});