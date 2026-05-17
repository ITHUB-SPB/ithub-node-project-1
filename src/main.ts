import express from "express";
import { engine } from "express-handlebars";

import { areaRoutes } from "./api/area/area.router.js";
import { bookingRoutes } from "./api/booking/booking.router.js";
import { timeslotRoutes } from "./api/timeslot/timeslot.router.js";

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", import.meta.dirname + "/views");

app.use("/public", express.static("public"));

app.use(express.json());

app.use(areaRoutes);
app.use(bookingRoutes);
app.use(timeslotRoutes);

app.get("/api", (_, response) =>
  response.json({
    status: "OK",
  })
);

app.listen(3000, () => {
  console.log(`App listening: http://localhost:3000/`);
  console.log(`API listening: http://localhost:3000/api/`);
});
