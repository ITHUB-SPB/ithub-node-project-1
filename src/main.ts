import express, { type Request, type Response } from "express";
import { areaRoutes } from "./api/area/area.router.js";
import bookingRouter from "./api/booking/booking.router.js";
import timeslotRouter from "./api/timeslot/timeslot.router.js";
import { engine } from "express-handlebars";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", import.meta.dirname + "/views");

app.use("/public", express.static("/public"));

app.use(express.json());

app.get("/", (request: Request, response: Response) => {
  const roomId = request.params["roomId"]
  const room = rooms.find(1)



  response.render("booking",{room});
});

app.use("/areas", areaRoutes);
app.use("/bookings", bookingRouter);
app.use("/timeslots", timeslotRouter);

app.get("/hc", (_, response) => {
  return response.json({ status: "OK" });
});

app.listen(3000, () => {
  console.log(`API server listening: http://localhost:3000`);
});
