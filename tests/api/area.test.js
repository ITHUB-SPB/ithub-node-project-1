import { describe, test, expect } from "vitest";

const BASE_URL = "http://localhost:3000";

describe("GET /api/areas", () => {
  test("вернуть список комнат", async () => {
    const response = await fetch(`${BASE_URL}/api/areas`);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.statusCode).toBe(200);
    expect(Array.isArray(json.data.areas)).toBe(true);
    expect(typeof json.data.totalItems).toBe("number");
  });

  test("вернуть правильные поля", async () => {
    const response = await fetch(`${BASE_URL}/api/areas`);
    const json = await response.json();

    if (json.data.areas.length > 0) {
      const area = json.data.areas[0];
      expect(area).toHaveProperty("id");
      expect(area).toHaveProperty("title");
    }
  });

  test("поддержка limit", async () => {
    const response = await fetch(`${BASE_URL}/api/areas?limit=1`);
    const json = await response.json();

    expect(json.data.areas.length).toBeLessThanOrEqual(1);
  });
});