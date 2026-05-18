import { Router } from "express";
import TimeslotController from "./timeslot.controller.js";

export const timeslotRoutes = Router();

timeslotRoutes.get("/", TimeslotController.getAll);