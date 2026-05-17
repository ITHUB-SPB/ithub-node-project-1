
import AreaService from "./api/area/area.service.js";
import TimeslotService from "./api/timeslot/timeslot.service.js";

app.get("/", async (request: Request, response: Response) => {
  const capacity = request.query.capacity as string | undefined;
  const amenities = request.query.amenities as string | undefined;
  const filter = request.query.filter as string | undefined;

  const rooms = await AreaService.findAll({
    capacity: capacity ? Number(capacity) : undefined,
    amenities: amenities?.split(","),
    filter: filter?.split(",").map(Number),
  });

  const allRoomsForFilter = await AreaService.findAllForFilter();

  response.render("index", {
    rooms,
    allRoomsForFilter,
    filters: { capacity, amenities: amenities?.split(",") || [] },
  });
});

app.get("/details/:roomId", async (request: Request, response: Response) => {
  const roomId = Number(request.params["roomId"]);
  const room = await AreaService.findById(roomId);

  if (!room) {
    return response.status(404).send("Комната не найдена");
  }

  response.render("detail", { room });
});

app.get("/booking/:roomId", async (request: Request, response: Response) => {
  const roomId = Number(request.params["roomId"]);
  const room = await AreaService.findById(roomId);
  
  if (!room) {
    return response.status(404).send("Комната не найдена");
  }

  response.render("booking", { room });
});

app.engine(
  "handlebars",
  engine({
    helpers: {
      includes: (value: string, array: string[] | undefined) => {
        if (!array) return false;
        return array.includes(String(value));
      },
    },
  })
);