import express, { Router } from "express";
import BookingController from "./booking.controller.js";
import { bookingView, bookingCreateView } from "./booking.views.js";

export const bookingRoutes = Router();

const formMiddleware = express.urlencoded({ extended: true })

bookingRoutes.get("/api/bookings", BookingController.find);
bookingRoutes.post("/api/bookings", BookingController.create);
bookingRoutes.delete("/api/bookings/:id", BookingController.delete);

bookingRoutes.get("/booking/:roomId", bookingView);
bookingRoutes.post("/booking/:roomId", formMiddleware, bookingCreateView);
