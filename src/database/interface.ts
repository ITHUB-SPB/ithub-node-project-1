export interface AmenitySchema {
  id: number;
  name: string;
  label: string;
}

export interface RoomAmenitySchema {
  room_id: number;
  amenity_id: number;
}

export interface AreaSchema {
  id: number;
  title: string;
  capacity: number; 
}


export interface Database {
  areas: AreaSchema;
  amenities: AmenitySchema;
  room_amenities: RoomAmenitySchema;
  bookings: BookingSchema;
  timeslots: TimeslotSchema;
}