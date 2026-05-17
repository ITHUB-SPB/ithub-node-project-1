
await db.schema
  .createTable("bookings")
  .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
  .addColumn("timeslotId", "integer", (col) => col.notNull())
  .addColumn("roomId", "integer", (col) => col.notNull()) 
  .addColumn("userId", "integer")
  .addColumn("createdAt", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
  .addForeignKeyConstraint("bookings_timeslot_id_foreign", ["timeslotId"], "timeslots", ["id"], (constraint) => constraint.onDelete("cascade"))
  .addForeignKeyConstraint("bookings_room_id_foreign", ["roomId"], "areas", ["id"], (constraint) => constraint.onDelete("cascade")) 
  .execute();