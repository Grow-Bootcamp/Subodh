import request from "supertest";
import app from "./app.js";

describe("Users API", () => {
  describe("GET /health", () => {
    it("responds with 200 and status ok", async () => {
      const { status, body } = await request(app).get("/health");

      expect(status).toBe(200);
      expect(body).toEqual({ status: "ok" });
    });
  });

  describe("GET /api/users", () => {
    it("returns a successful response with a list of users", async () => {
      const { status, body } = await request(app).get("/api/users");

      expect(status).toBe(200);
      expect(body).toMatchObject({
        success: true,
        data: expect.any(Array),
      });
      expect(body.data.length).toBeGreaterThan(0);
    });

    it("returns users with the expected shape", async () => {
      const { body } = await request(app).get("/api/users");

      expect(body.data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      );
    });
  });

  describe("GET /api/users/:id", () => {
    it("returns the matching user when the id exists", async () => {
      const { status, body } = await request(app).get("/api/users/1");

      expect(status).toBe(200);
      expect(body.data).toMatchObject({ id: 1, name: "Alice" });
    });

    it("returns 404 with an error when the id does not exist", async () => {
      const { status, body } = await request(app).get("/api/users/999");

      expect(status).toBe(404);
      expect(body).toEqual({
        success: false,
        error: "Not found",
      });
    });
  });
});
