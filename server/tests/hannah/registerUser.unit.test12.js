const { describe, it, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const { registerUser } = require("../../controllers/userController");
const User = require("../../models/userSchema");

describe("User Registration Tests", () => {
  let mockRequest,
    mockResponse,
    nextFunction,
    statusSpy,
    jsonSpy,
    originalFindOne,
    originalCreate;

  beforeEach(() => {
    statusSpy = { calledWith: null };
    jsonSpy = { calledWith: null };
    mockResponse = {
      status: function (statusCode) {
        statusSpy.calledWith = statusCode;
        return this;
      },
      json: function (payload) {
        jsonSpy.calledWith = payload;
      },
    };
    nextFunction = (err) => {
      throw new Error(`Unhandled error in next function: ${err.message}`);
    };
    // Mock setup for User methods
    User.findOne = async (query) => {
      if (query.email === "hannah@ntnu.no") return { _id: "30" }; // Simulate existing user
      return null; // No user found by default
    };
    User.create = async (userData) => ({
      _doc: { ...userData, _id: "newUserId" },
    });

    // Store original methods
    originalFindOne = User.findOne;
    originalCreate = User.create;
  });

  afterEach(() => {
    // Restore original methods
    User.findOne = originalFindOne;
    User.create = originalCreate;
  });

  it("rejects registration when the name field is empty", async () => {
    mockRequest = {
      body: {
        name: "",
        email: "hannah@stud.ntnu.no",
        password: "StrongPass!23",
      },
    };
    await registerUser(mockRequest, mockResponse, nextFunction);
    assert.strictEqual(statusSpy.calledWith, 400);
    assert.deepStrictEqual(jsonSpy.calledWith, { error: "Name is required" });
  });

  it("rejects registration with a non-NTNU email address", async () => {
    mockRequest = {
      body: {
        name: "Hannah Eriksen",
        email: "hannah@example.no", // Non-NTNU email
        password: "StrongPass!23",
      },
    };
    await registerUser(mockRequest, mockResponse, nextFunction);
    assert.strictEqual(statusSpy.calledWith, 400);
    assert.deepStrictEqual(jsonSpy.calledWith, {
      error: "Please use a valid NTNU email address.",
    });
  });

  it("rejects registration with a weak password", async () => {
    mockRequest = {
      body: {
        name: "Hannah Eriksen",
        email: "hannah@stud.ntnu.no",
        password: "weak",
      },
    };
    await registerUser(mockRequest, mockResponse, nextFunction);
    assert.strictEqual(statusSpy.calledWith, 400);
    assert.deepStrictEqual(jsonSpy.calledWith, {
      error:
        "Password must be stronger. At least 6 characters, including a number, a symbol, and mixed case letters.",
    });
  });

  it("successfully registers a user with valid inputs", async () => {
    mockRequest = {
      body: {
        name: "Hannah Eriksen",
        email: "hannah@stud.ntnu.no",
        password: "StrongPass!23",
      },
    };
    await registerUser(mockRequest, mockResponse, nextFunction);
    assert.strictEqual(statusSpy.calledWith, 201);
    assert.strictEqual(jsonSpy.calledWith.status, "success");
    assert.strictEqual(
      jsonSpy.calledWith.message,
      "User registered successfully"
    );
    assert.strictEqual(jsonSpy.calledWith.user.email, "hannah@stud.ntnu.no");
  });

  describe("Boundary and Edge Cases", () => {
    it("rejects excessively long names", async () => {
      const longName = "a".repeat(51); // Exceeding the 50 characters limit
      mockRequest = {
        body: {
          name: longName,
          email: "hannah@stud.ntnu.no",
          password: "StrongPass!23",
        },
      };
      await registerUser(mockRequest, mockResponse, nextFunction);
      assert.strictEqual(statusSpy.calledWith, 400);
      assert.ok(
        jsonSpy.calledWith.error.includes("Name cannot exceed 50 characters")
      );
    });

    it("accepts name with punctuation and spaces", async () => {
      const complexName = "Hånnåh-Sofie Æriksen";
      mockRequest = {
        body: {
          name: complexName,
          email: "hannahsofie@stud.ntnu.no",
          password: "StrongPass!23",
        },
      };
      await registerUser(mockRequest, mockResponse, nextFunction);
      assert.strictEqual(statusSpy.calledWith, 201);
      assert.strictEqual(jsonSpy.calledWith.user.name, complexName);
    });
  });

  it("rejects undefined inputs", async () => {
    mockRequest = { body: {} };
    await registerUser(mockRequest, mockResponse, nextFunction);
    assert.strictEqual(statusSpy.calledWith, 400);
    assert.ok(jsonSpy.calledWith.error.includes("required"));
  });
});
