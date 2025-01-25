import { Express } from "express";
import request from "supertest";

// DB Connectivity
import mongoose from "mongoose";
import { initApp } from "../src/app";

// Schemas and Models
import { Post } from "../src/models/post";
import { User } from "../src/models/user";
import { IUser } from "../src/types/models";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await User.deleteMany();
  await Post.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: User = {
  username: "test",
  email: "test@user.com",
  password: "testpassword",
}

describe("Auth Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "aef",
    });
    expect(response.statusCode).not.toBe(200);
    const response1 = await request(app).post(baseUrl + "/register").send({
      username: "aef",
    });
    expect(response1.statusCode).not.toBe(200);
    const response2 = await request(app).post(baseUrl + "/register").send({
      username: "",
      email: "",
      password: "aef",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      username: testUser.username,
      email: testUser.email,
      password: "aefe",
    });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app).post(baseUrl + "/login").send({
      username: "aef",
      email: "afe",
      password: "aefef",
    });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test me", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content"
    });
    expect(response.statusCode).not.toBe(200);
    const response2 = await request(app).post("/posts").set(
      { 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      }
    ).send({
      title: "Test Post",
      content: "Test Content"
    });
    expect(response2.statusCode).toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Double use refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    const refreshTokenNew = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: refreshTokenNew,
    });
    expect(response3.statusCode).not.toBe(200);
  });

  test("Test logout", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);

  });

  jest.setTimeout(10000);
  test("Test timeout token (Make sure the experation is 3s)", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app).post("/posts").set(
      { 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      }
    ).send({
      title: "Test Post",
      content: "Test Content"
    });
    expect(response2.statusCode).toBe(200);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response3 = await request(app).post("/posts").set(
      { 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      }
    ).send({
      title: "Test Post",
      content: "Test Content"
    });
    expect(response3.statusCode).toBe(200);
  });

  test("Creata post without login in", async () => {
    const response = await request(app).post("/posts")
      .send({
        title: "Test Post",
        content: "Test Content"
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test refresh token with missing TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(400);

    process.env.TOKEN_SECRET = originalTokenSecret;
  });

  test("Test refresh with invalid user ID in token", async () => {
    // Create a token with non-existent user ID
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY3ZjM5NDQ2ZjE2YjQ3ZjI5YzE2OTEiLCJyYW5kb20iOiIwLjQ3MzczNDc1Mjk3NTc4OTQiLCJpYXQiOjE2OTM5MzQxMzIsImV4cCI6MTY5MzkzNDczMn0.ZQxgpcwIxCQgxwGMhmbOt-YC_xkH3YBYJKiNYPQpQP0";
    
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: invalidToken,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test refresh with invalid token format", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: "invalid.token.format",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test refresh with missing refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({});
    expect(response.statusCode).toBe(400);
  });

  test("Test login with missing TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(500);

    process.env.TOKEN_SECRET = originalTokenSecret;
  });

  test("Test logout with missing refresh token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({});
    expect(response.statusCode).toBe(400);
  });

  test("Test logout with invalid refresh token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: "invalid.token.format"
    });
    expect(response.statusCode).toBe(400);
  });
});

describe("Auth Middleware Tests", () => {
  test("Test missing TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "Test Post",
        content: "Test Content"
      });
    expect(response.statusCode).toBe(500);

    process.env.TOKEN_SECRET = originalTokenSecret;
  });

  test("Test invalid refresh token", async () => {
    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": "invalid_refresh_token"
      })
      .send({
        title: "Test Post",
        content: "Test Content"
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test JWT verification failure", async () => {
    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer invalid_token",
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "Test Post",
        content: "Test Content"
      });
    expect(response.statusCode).toBe(401);
  });
});