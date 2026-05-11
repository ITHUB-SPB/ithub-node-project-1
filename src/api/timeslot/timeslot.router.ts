import { Router } from "express";
import TimeslotController from "./timeslot.controller.js";

export const timeslotRoutes = Router();

timeslotRoutes.get("/api/timeslots", TimeslotController.findAll);
