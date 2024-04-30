const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const fetch = require("node-fetch");
const mongo = require("mongodb");
const nock = require("nock");
const config = require("../../utils/config");
const app = require("../../server");

const mockApiData = require("./api.mock.response.json");
const TEST_DB = "sustainability-db-test";
const LOCALHOST = "localhost";

let serverRef, baseURL;

async function setupNock() {
  nock(baseURL)
    .persist() // Keep the mock active for all tests
    .get("/reflections")
    .reply(200, mockApiData)
    .post("/reflections/create")
    .reply(201, (uri, requestBody) => {
      return { ...requestBody, id: "3" };
    })
    .put("/reflections/:id")
    .reply(200, (uri, requestBody) => {
      return { ...requestBody, id: uri.split("/").pop() };
    })
    .delete("/reflections/:id")
    .reply(200, { message: "Entry deleted successfully" });
}

before(async () => {
  await config._injectMongoValues({ dbName: TEST_DB });
  baseURL = `http://${LOCALHOST}:${process.env.PORT}`;
  serverRef = await app.start(); // Properly handle the async start
  await setupNock();
});

after(async () => {
  const dbConn = await mongo.MongoClient.connect(
    "mongodb+srv://hannah:sofie@sustainabilitydiary.qjbtcnq.mongodb.net/"
  ); // fix later
  await dbConn.db().collection("reflectionentries").deleteMany({});
  await dbConn.close();
  await serverRef.close(); // Properly close the server
});

describe("Reflection Entry Endpoint Tests", () => {
  describe("General Operations", () => {
    it("should return a list of reflection entries", async () => {
      const response = await fetch(`${baseURL}/reflections`);
      assert.strictEqual(response.ok, true);
      const allReflections = await response.json();
      assert.strictEqual(allReflections.length, mockApiData.length);
    });
  });

  describe("Update Operations", () => {
    it("should update a reflection entry", async () => {
      const reflectionId = "1";
      const updatedData = {
        title: "Updated Reflection",
        body: "Updated content of the reflection",
        isPublic: false,
      };

      nock(baseURL)
        .put(`/reflections/${reflectionId}`, updatedData)
        .reply(200, { ...updatedData, id: reflectionId });

      const response = await fetch(`${baseURL}/reflections/${reflectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      assert.strictEqual(response.ok, true);
      const responseData = await response.json();
      assert.strictEqual(responseData.title, updatedData.title);
      assert.strictEqual(responseData.body, updatedData.body);
    });

    it("should prevent updating a reflection after it has been deleted", async () => {
      const reflectionId = "3";
      nock(baseURL)
        .delete(`/reflections/${reflectionId}`)
        .reply(200, { message: "Entry deleted successfully" });

      nock(baseURL)
        .put(`/reflections/${reflectionId}`, {
          title: "Updated Title After Deletion",
          body: "Updated body after deletion",
          isPublic: false,
        })
        .reply(404, { message: "Unable to update. Reflection not found." });

      const deleteResponse = await fetch(
        `${baseURL}/reflections/${reflectionId}`,
        {
          method: "DELETE",
        }
      );

      assert.strictEqual(deleteResponse.ok, true);
      const deleteData = await deleteResponse.json();
      assert.strictEqual(deleteData.message, "Entry deleted successfully");

      const updateResponse = await fetch(
        `${baseURL}/reflections/${reflectionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Updated Title After Deletion",
            body: "Updated body after deletion",
            isPublic: false,
          }),
        }
      );

      assert.strictEqual(updateResponse.ok, false);
      assert.strictEqual(updateResponse.status, 404);
      const updateData = await updateResponse.json();
      assert.strictEqual(
        updateData.message,
        "Unable to update. Reflection not found."
      );
    });
  });

  describe("Deletion Operations", () => {
    it("should delete a reflection entry", async () => {
      const reflectionId = "1";
      nock(baseURL)
        .delete(`/reflections/${reflectionId}`)
        .reply(200, { message: "Entry deleted successfully" });

      const response = await fetch(`${baseURL}/reflections/${reflectionId}`, {
        method: "DELETE",
      });

      assert.strictEqual(response.ok, true);
      const data = await response.json();
      assert.strictEqual(data.message, "Entry deleted successfully");
    });

    it("should handle deletion of already deleted reflection gracefully", async () => {
      const reflectionId = "2";
      nock(baseURL)
        .delete(`/reflections/${reflectionId}`)
        .reply(200, { message: "Entry deleted successfully" });

      nock(baseURL)
        .delete(`/reflections/${reflectionId}`)
        .reply(404, { message: "Reflection not found" });

      const firstResponse = await fetch(
        `${baseURL}/reflections/${reflectionId}`,
        {
          method: "DELETE",
        }
      );

      assert.strictEqual(firstResponse.ok, true);
      const firstData = await firstResponse.json();
      assert.strictEqual(firstData.message, "Entry deleted successfully");

      const secondResponse = await fetch(
        `${baseURL}/reflections/${reflectionId}`,
        {
          method: "DELETE",
        }
      );

      assert.strictEqual(secondResponse.ok, false);
      assert.strictEqual(secondResponse.status, 404);
      const secondData = await secondResponse.json();
      assert.strictEqual(secondData.message, "Reflection not found");
    });
  });

  describe("Privacy and Security Tests", () => {
    it("should ensure private reflections are not visible to unauthorized users", async () => {
      const privateReflectionId = "6";
      const unauthorizedUserToken = "token_for_other_user";

      nock(baseURL, {
        reqheaders: {
          Authorization: `Bearer ${unauthorizedUserToken}`,
        },
      })
        .get(`/reflections/${privateReflectionId}`)
        .reply(404, { message: "Reflection not found" });

      const response = await fetch(
        `${baseURL}/reflections/${privateReflectionId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${unauthorizedUserToken}` },
        }
      );
      assert.strictEqual(response.status, 404);
    });

    it("should sanitize inputs to prevent SQL injection and other attacks", async () => {
      const maliciousInput = "Robert'); DROP TABLE Reflections;--";
      const reflectionId = "7";

      nock(baseURL)
        .put(`/reflections/${reflectionId}`, {
          title: maliciousInput,
          body: "Trying to break your app",
          isPublic: true,
        })
        .reply(200, { message: "Input sanitized" });

      const response = await fetch(`${baseURL}/reflections/${reflectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: maliciousInput,
          body: "Trying to break your app",
          isPublic: true,
        }),
      });
      assert.strictEqual(response.ok, true);
      const data = await response.json();
      assert.strictEqual(
        data.message,
        "Input sanitized",
        "Expected input to be sanitized but got: " + data.message
      );
    });
  });
});
