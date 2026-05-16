import { Router } from "express";

import AreaController from "./area.controller.js";
import { areasListView, areaDetailView } from "./area.views.js";

export const areaRoutes = Router({ mergeParams: true });

areaRoutes.get("/api/areas", AreaController.findAll);

areaRoutes.get("/details/:roomId", areaDetailView);
areaRoutes.get("/", areasListView);
