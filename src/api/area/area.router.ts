import { Router } from "express";
import AreaController from "./area.controller.js";

export const areaRouter = Router();

areaRouter.get("/", AreaController.getAll);
areaRouter.get("/:id", AreaController.getById);