import { Router } from "express";
import BookingController from "./booking.controller.js";

export const bookingRoutes = Router();

bookingRoutes.get("/", BookingController.list);
bookingRoutes.post("/", BookingController.add);
bookingRoutes.delete("/:id", BookingController.remove);