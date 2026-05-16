import type { Generated } from "kysely";
import * as v from "valibot";

export const bookingSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  timeslotId: v.pipe(v.number(), v.integer()),  
  areaId: v.pipe(v.number(), v.integer()),      
  name: v.pipe(v.string(), v.nonEmpty()),       
  theme: v.optional(v.string()),                
  userId: v.optional(v.number()),               
  createdAt: v.optional(v.string()),            
});

export type BookingSchema = v.InferOutput<typeof bookingSchema> & {
  id: Generated<"id">;
  timeslotId: number;
  areaId: number;
  name: string;
  theme?: string | null;
  userId?: number | null;
  createdAt?: string;
};
