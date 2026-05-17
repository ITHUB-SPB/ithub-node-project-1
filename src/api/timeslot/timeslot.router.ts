import { Router } from "express";
import TimeslotController from "./timeslot.controller.js";

export const timeslotRoutes = Router();

timeslotRoutes.get("/", TimeslotController.findAll);
timeslotRoutes.get("/free/:roomId", TimeslotController.getFreeSlots);