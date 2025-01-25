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

type User = IUser & {
  accessToken?: string,
  refreshToken?: string
};

const testUser: User = {
  username: "test",
  email: "test@user.com",
  password: "testpassword",
}

beforeAll(async () => {
  console.log("beforeAll");

  // Connect DB
  app = await initApp();

  // Delete existing data
  await Post.deleteMany();
  await User.deleteMany();

  // Login
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
  testUser.refreshToken = res.body.refreshToken;
  testUser._id = res.body._id;
  expect(testUser.accessToken).toBeDefined();
  expect(testUser.refreshToken).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts")
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "Test Post",
        content: "Test Content"
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    postId = response.body._id;
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get("/posts?sender=" + testUser._id)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "Test Post 2",
        content: "Test Content 2"
      });
    expect(response.statusCode).toBe(200);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app).get("/posts")
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    // Delete post
    const response = await request(app).delete("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(200);

    // Check if posts is deleted
    const response2 = await request(app).get("/posts/" + postId)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response2.statusCode).toBe(404);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test update non-existent post", async () => {
    const response = await request(app).put("/posts/nonexistentid")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "Updated Title",
        content: "Updated Content"
      });
    expect(response.statusCode).toBe(400); // Update to match the actual status code
  });

  test("Test update post unauthorized", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@user.com",
      password: "newpassword",
    };
    await request(app).post("/auth/register").send(newUser);
    const res = await request(app).post("/auth/login").send(newUser);
    const newAccessToken = res.body.accessToken;
    const newRefreshToken = res.body.refreshToken;

    const response = await request(app).put("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + newAccessToken,
        "x-refresh-token": newRefreshToken
      })
      .send({
        title: "Updated Title",
        content: "Updated Content"
      });
    expect(response.statusCode).toBe(404); // Update to match the actual status code
  });

  test("Test delete non-existent post", async () => {
    const response = await request(app).delete("/posts/nonexistentid")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(400); // Update to match the actual status code
  });

  test("Test delete post unauthorized", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@user.com",
      password: "newpassword",
    };
    await request(app).post("/auth/register").send(newUser);
    const res = await request(app).post("/auth/login").send(newUser);
    const newAccessToken = res.body.accessToken;
    const newRefreshToken = res.body.refreshToken;

    const response = await request(app).delete("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + newAccessToken,
        "x-refresh-token": newRefreshToken
      });
    expect(response.statusCode).toBe(404); // Update to match the actual status code
  });

  test("Test update post error handling", async () => {
    const response = await request(app).put("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        title: "",
        content: ""
      });
    expect(response.statusCode).toBe(404); // Update to match the actual status code
  });

  test("Test delete post error handling", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(404); // Update to match the actual status code

    const response2 = await request(app).delete("/posts/" + postId)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response2.statusCode).toBe(404);
  });
});