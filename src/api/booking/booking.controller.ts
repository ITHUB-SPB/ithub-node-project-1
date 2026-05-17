static async create(request: Request, response: Response): Promise<Response> {
  try {
    const payload = v.parse(schema.newBookingInSchema, request.body);
    const createdBooking = await BookingService.create(payload);
    return response.status(201).json({ booking: createdBooking });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return response.status(400).json({ error: message });
  }
}