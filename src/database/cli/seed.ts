
function seedAreas() {
  const insertArea = connection.prepare(
    "INSERT INTO areas (title, capacity) VALUES (?, ?)"
  );
  const insertRoomAmenity = connection.prepare(
    "INSERT INTO room_amenities (room_id, amenity_id) VALUES (?, ?)"
  );

  const getAmenityId = (name: string) =>
    connection.prepare("SELECT id FROM amenities WHERE name = ?").get(name).id;

  const rooms = [
    { title: "A-101", capacity: 24, amenities: ["plasma", "board", "wifi"] },
    { title: "A-102", capacity: 14, amenities: ["plasma", "wifi"] },
    { title: "B-140", capacity: 30, amenities: ["board", "wifi"] },
  ];

  for (const room of rooms) {
    const result = insertArea.run(room.title, room.capacity);
    const roomId = result.lastInsertRowid;

    for (const amenityName of room.amenities) {
      const amenityId = getAmenityId(amenityName);
      insertRoomAmenity.run(roomId, amenityId);
    }
  }
  console.log(chalk.green(`✔ Добавлены комнаты и их удобства`));
}

function seedAmenities() {
  const stmt = connection.prepare("INSERT INTO amenities (name, label) VALUES (?, ?)");
  const amenities = [
    ["plasma", "Плазма"],
    ["board", "Доска"],
    ["wifi", "Wi-Fi"],
  ];
  for (const [name, label] of amenities) {
    stmt.run(name, label);
  }
  console.log(chalk.green(`✔ Добавлены удобства`));
}

