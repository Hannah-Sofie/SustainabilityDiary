const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const path = require("path");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const { exec } = require("child_process");

// Assuming you have an Express app exported from your main server file
const app = require("../../server.js");

const TEST_DB_NAME = "testDbName";
let mongoClient;

// Function to execute shell commands, used for Docker Compose
const execPromise = (cmd, opts = {}) =>
  new Promise((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      if (err) return reject({ err, stderr });
      resolve(stdout);
    });
  });

before(async () => {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
  dotenv.config({ path: path.join(__dirname, "../../.mongo.env") });

  // Setup test database using Docker Compose
  try {
    await execPromise(
      `docker-compose -f ${path.join(
        __dirname,
        "../../debug-compose.yaml"
      )} up -d test-mongodb-debug`
    );
    ("MongoDB container is up");
  } catch (error) {
    console.error("Error starting MongoDB container:", error);
    throw error;
  }

  // Wait for a few seconds to ensure MongoDB is fully ready (adjust the delay as needed)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const URI = `mongodb://localhost:${process.env.MONGO_PORT}/${TEST_DB_NAME}`;
  try {
    mongoClient = await MongoClient.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    ("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
});

after(async () => {
  try {
    await mongoClient.db(TEST_DB_NAME).dropDatabase();
    ("Test database dropped");
    await mongoClient.close();
    ("MongoDB connection closed");
  } catch (error) {
    console.error("Error during database cleanup:", error);
    throw error;
  }

  // Shut down the MongoDB container
  try {
    await execPromise(
      `docker-compose -f ${path.join(
        __dirname,
        "../../debug-compose.yaml"
      )} down`
    );
    ("MongoDB container is down");
  } catch (error) {
    console.error("Error stopping MongoDB container:", error);
    throw error;
  }
});

describe("User registration and login", () => {
  it("should register a user", async () => {
    const response = await request(app).post("/register").send({
      name: "Hello Test",
      email: "hei3@stud.ntnu.no", // Needs to change for each test
      password: "StrongP@ssword123!",
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.status, "success");
  });

  it("should login the user", async () => {
    const loginResponse = await request(app).post("/login").send({
      email: "hei3@stud.ntnu.no", // Needs to match the email used in the registration test
      password: "StrongP@ssword123!",
    });

    assert.strictEqual(loginResponse.status, 200);
    assert.strictEqual(loginResponse.body.status, "success");
  });
});
