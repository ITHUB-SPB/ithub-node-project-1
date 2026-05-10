import express from "express";
import type { Request, Response } from "express";
import { engine } from "express-handlebars";

import { areaRoutes } from "./api/area/area.router.js";
import { bookingRoutes } from "./api/booking/booking.router.js";
import { timeslotRoutes } from "./api/timeslot/timeslot.router.js";

type Booking = {
  id: number;
  title: string;
  organizer: string;
  time: string;
};

type Room = {
  id: number;
  title: string;
  city: string;
  location: string;
  capacity: string;
  wifi: string;
  hasTv: string;
  hasBoard: string;
  image: string;
  detailImage: string;
  bookings: Booking[];
};

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const roomImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
];

const rooms: Room[] = Array.from({ length: 8 }, (_, index) => {
  const names = [
    "A-101",
    "A-102",
    "B-140",
    "Austin",
    "Boston",
    "Chicago",
    "Denver",
    "Seattle",
  ];

  return {
    id: index + 1,
    title: names[index % names.length],
    city: "Dev Bay",
    location: "Dev Bay, Chennai",
    capacity: index % 3 === 0 ? "20-24" : index % 3 === 1 ? "10-14" : "5-10",
    wifi: index % 2 === 0 ? "Sirius Guest" : "Dev Guest",
    hasTv: index % 2 === 0 ? "yes" : "No",
    hasBoard: index % 3 === 0 ? "yes" : "No",
    image: roomImages[index % roomImages.length],
    detailImage: roomImages[(index + 1) % roomImages.length],
    bookings: [
      {
        id: 1,
        title: "React Review",
        organizer: "Nijin",
        time: "10:00 -10:30 AM",
      },
      {
        id: 2,
        title: "React Review",
        organizer: "Nijin",
        time: "10:00 -10:30 AM",
      },
    ],
  };
});

rooms.push({
  id: rooms.length + 1,
  title: "C-205",
  city: "Dev Bay",
  location: "Dev Bay, Chennai",
  capacity: "15-20",
  wifi: "Sirius Guest",
  hasTv: "yes",
  hasBoard: "yes",
  image: "/public/images/205.png",
  detailImage: "/public/images/205.png",
  bookings: [
    {
      id: 1,
      title: "Node.js Meeting",
      organizer: "Islam",
      time: "12:00 -12:30 PM",
    },
  ],
});

rooms.push({
  id: rooms.length + 1,
  title: "C-200",
  city: "Dev Bay",
  location: "Dev Bay, Chennai",
  capacity: "15-20",
  wifi: "Sirius Guest",
  hasTv: "yes",
  hasBoard: "yes",
  image: "/public/images/room-c200.png",
  detailImage: "/public/images/room-c200.png",
  bookings: [],
});

app.get("/", (_request: Request, response: Response) => {
  response.render("index", {
    rooms,
    total: rooms.length,
  });
});

app.get("/rooms/:roomId", (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const room = rooms.find((room) => room.id === Number(roomId));

  if (!room) {
    response.status(404).send("Комната не найдена");
    return;
  }

  response.render("detail", { room });
});

app.get("/booking/:roomId", (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const room = rooms.find((room) => room.id === Number(roomId));

  if (!room) {
    response.status(404).send("Комната не найдена");
    return;
  }

  response.render("booking", { room });
});

app.post("/booking/:roomId", (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const room = rooms.find((room) => room.id === Number(roomId));

  if (!room) {
    response.status(404).send("Комната не найдена");
    return;
  }

  const { title, organizer, start, end } = request.body as {
    title?: string;
    organizer?: string;
    start?: string;
    end?: string;
  };

  room.bookings.push({
    id: room.bookings.length + 1,
    title: title || "Без темы",
    organizer: organizer || "Не указан",
    time: `${start || "--:--"} -${end || "--:--"}`,
  });

  response.redirect(`/rooms/${room.id}`);
});

/*
 API ROUTES
*/

app.use("/api/areas", areaRoutes);
app.use("/api/timeslots", timeslotRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (_, response) => {
  return response.json({
    status: "OK",
  });
});

app.listen(3000, () => {
  console.log("App listening: http://localhost:3000/");
  console.log("API listening: http://localhost:3000/api/");
});
app.get("/booking/:roomId", (request: Request, response: Response) => {
  const roomId = request.params["roomId"];
  const room = rooms.find((room) => room.id === Number(roomId));

  response.render("booking", { room });
});

/*
   API ROUTES
*/

app.use("/api/areas", areaRoutes);
app.use("/api/timeslots", timeslotRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/api/health", (_, response) => {
  return response.json({
    status: "OK",
  });
});

app.listen(3000, () => {
  console.log("App listening: http://localhost:3000/");
  console.log("API listening: http://localhost:3000/api/");
});
