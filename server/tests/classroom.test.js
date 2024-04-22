const request = require("supertest");
const app = require("../src/app");

describe("GET /api/classrooms", () => {
  it("responds with json", (done) => {
    request(app)
      .get("/api/classrooms")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
