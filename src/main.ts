import express from "express";
import { areaRouter } from "./api/area/area.router.js";
import { bookingRoutes } from "./api/booking/booking.router.js";
import { timeslotRoutes } from "./api/timeslot/timeslot.router.js";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/api/areas", areaRouter);
server.use("/api/bookings", bookingRoutes);
server.use("/api/timeslots", timeslotRoutes);

server.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const SERVER_PORT = process.env.PORT || 4000;

server.listen(SERVER_PORT, () => {
  console.log(`Сервер запущен на http://localhost:${SERVER_PORT}`);
});

export default server;