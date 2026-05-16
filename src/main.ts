import express, { type Request, type Response } from "express";
import { engine } from "express-handlebars";
import db from "./database/connection.js";
import { areaRoutes } from "./api/area/area.router.js";
import { bookingRoutes } from "./api/booking/booking.router.js";
import { timeslotRoutes } from "./api/timeslot/timeslot.router.js";
import { request } from "node:http";
import { number } from "valibot";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", import.meta.dirname + "/views");

app.use("/public", express.static("public"));

app.use(express.json());

app.get("/", async (request: Request, response: Response) => {
  let query = db.selectFrom("areas").selectAll();

  let areasFromDb = await query.execute();
  const timeslots = await db.selectFrom("timeslots").selectAll().execute();

  const transformedRooms = areasFromDb.map((area) => ({
    id: area.id,
    title: area.title,
    capacity: area.capacity,
    hasPlasma: area.hasPlasma,
    hasBoard: area.hasBoard,
    hasWifi: area.hasWifi,
  }));

  response.render("index", {
    rooms: transformedRooms,
    timeslots: timeslots,
    layout: false,
  });
});

app.get("/details/:roomId", async (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const area = await db
    .selectFrom("areas")
    .where("id", "=", Number(roomId))
    .selectAll()
    .executeTakeFirst();

  if (!area) {
    return response.status(404).send("Комната не найдена");
  }

  const bookings = await db
    .selectFrom("bookings")
    .innerJoin("timeslots", "timeslots.id", "bookings.timeslotId")
    .where("bookings.areaId", "=", Number(roomId))
    .selectAll()
    .execute();

  const timeslots = await db.selectFrom("timeslots").selectAll().execute();

  const room = {
    id: area.id,
    title: area.title,
    capacity: area.capacity,
    hasPlasma: area.hasPlasma,
    hasBoard: area.hasBoard,
    hasWifi: area.hasWifi,
    bookings: bookings,
    timeslots: timeslots,
    error: request.query["error"],
    success: request.query["success"],
  };

  response.render("detail", { room, layout: false });
});

app.use(express.urlencoded({ extended: true }));
app.post("/details/:roomId", async (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const { name, theme, timeslotId } = request.body;



  const existingBooking = await db
    .selectFrom("bookings")
    .where("timeslotId", "=", parseInt(timeslotId as string))
    .where("areaId", "=", parseInt(roomId))
    .selectAll()
    .executeTakeFirst();

  if (existingBooking) {
    console.log("Ошибка: время занято");
    return response.redirect(`/details/${roomId}?error=время занято`);
  }

  await db
    .insertInto("bookings")
    .values({
      timeslotId: parseInt(timeslotId as string),
      areaId: parseInt(roomId),
      name: name.trim(),
      theme: theme || null,
      userId: null,
    })
    .execute();
  response.redirect(`/details/${roomId}?success=забронировано`);
});

app.get("/api/filter_rooms", async (request: Request, response: Response) => {
  let query = db.selectFrom("areas").selectAll();
  const { bonus, capacity, timeslotId } = request.query;

  if (bonus) {
    const bonusList = Array.isArray(bonus) ? bonus : [bonus];
    for (const b of bonusList) {
      switch (b) {
        case "plasma":
          query = query.where("hasPlasma", "=", 1);
          break;
        case "board":
          query = query.where("hasBoard", "=", 1);
          break;
        case "wifi":
          query = query.where("hasWifi", "=", 1);
          break;
      }
    }
  }

  let areasFromDb = await query.execute();

  if (capacity) {
    const requiredPeople = parseInt(capacity as string);
    if (!isNaN(requiredPeople)) {
      areasFromDb = areasFromDb.filter((area) => {
        const capacityStr = area.capacity as string;
        if (!capacityStr) return false;

        const capacity_split = capacityStr.split("-");
        if (capacity_split.length < 2) return false;

        const minCapacity = parseInt(capacity_split[0]);
        const maxCapacity = parseInt(capacity_split[1]);

        if (isNaN(minCapacity) || isNaN(maxCapacity)) return false;

        return requiredPeople >= minCapacity && requiredPeople <= maxCapacity;
      });
    }
  }

  if (timeslotId) {
    const slotId = parseInt(timeslotId as string);

    const bookedRooms = await db
      .selectFrom("bookings")
      .where("timeslotId", "=", slotId)
      .select("areaId")
      .execute();

    const bookedRoomIds = bookedRooms.map((b) => Number(b.areaId));
    areasFromDb = areasFromDb.filter(
      (area) => !bookedRoomIds.includes(Number(area.id)),
    );
  }

  response.json(areasFromDb);
});

app.get(
  "/api/slots_available_to_book",
  async (request: Request, response: Response) => {
    const areaId = request.query["areaId"] as string;
    const timeslots = await db.selectFrom("timeslots").selectAll().execute();
    const bookings = await db
      .selectFrom("bookings")
      .where("areaId", "=", parseInt(areaId))
      .select("timeslotId")
      .execute();

    const bookedTime = bookings.map((b) => Number(b.timeslotId));

    const available_slots = timeslots.filter(
      (slot) => !bookedTime.includes(Number(slot.id)),
    );

    response.json(available_slots);
  },
);

app.use(areaRoutes);
app.use(bookingRoutes);
app.use(timeslotRoutes);

app.get("/api", (_, response) =>
  response.json({
    status: "OK",
  }),
);

app.listen(3000, () => {
  console.log(`App listening: http://localhost:3000/`);
  console.log(`API listening: http://localhost:3000/api/`);
});
