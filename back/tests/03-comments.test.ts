import { Express } from "express";
import request from "supertest";

// DB Connectivity
import mongoose from "mongoose";
import { initApp } from "../src/app";

// Schemas and Models
import { User } from "../src/models/user";
import { IUser } from "../src/types/models";
import { Post } from "../src/models/post";
import { Comment } from "../src/models/comment";
import testComments from "./comments_testing.json";

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

let postId = ""

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  
  // Delete existing data
  await Comment.deleteMany();
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
  postId = response.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comments test post by id", async () => {
    const response = await request(app).get("/comments/" + postId)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments")
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    })
    .send( {
      "content": testComments.comments[0].content,
      "postId": postId
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(testComments.comments[0].content);
    expect(response.body.postId).toBe(postId);
    commentId = response.body._id;
  });

  test("Comments update", async () => {
    const response = await request(app).put("/comments/" + commentId)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    }).send({"content": testComments.comments[1].content});
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(testComments.comments[1].content);
  });

  test("Comments delete", async () => {
    // Delete comment
    const response = await request(app).delete("/comments/" + commentId)
    .set({ 
      "Authorization": "Bearer " + testUser.accessToken,
      "x-refresh-token": testUser.refreshToken
    });
    expect(response.statusCode).toBe(200);
  });

  test("Test Create Comment with invalid data", async () => {
    const response = await request(app).post("/comments")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        content: "" // Invalid empty content
      });
    expect(response.statusCode).toBe(400);
  });

  test("Test Get Comments with invalid post ID", async () => {
    const response = await request(app).get("/comments/invalidpostid")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Update Comment unauthorized", async () => {
    // Create a new user
    const newUser = {
      username: "test2",
      email: "test2@user.com",
      password: "test2password"
    };
    await request(app).post("/auth/register").send(newUser);
    const res = await request(app).post("/auth/login").send(newUser);
    const newAccessToken = res.body.accessToken;
    const newRefreshToken = res.body.refreshToken;

    // Try to update comment with different user
    const response = await request(app).put("/comments/" + commentId)
      .set({ 
        "Authorization": "Bearer " + newAccessToken,
        "x-refresh-token": newRefreshToken
      })
      .send({
        content: "Updated by unauthorized user"
      });
    expect(response.statusCode).toBe(404);
  });

  test("Test Delete Comment unauthorized", async () => {
    // First create a comment as the original user
    const createResponse = await request(app).post("/comments")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        content: "Comment to be deleted",
        postId: postId
      });
    expect(createResponse.statusCode).toBe(200);
    const newCommentId = createResponse.body._id;

    // Try to delete with different user
    const newUser = {
      username: "test3",
      email: "test3@user.com",
      password: "test3password"
    };
    await request(app).post("/auth/register").send(newUser);
    const res = await request(app).post("/auth/login").send(newUser);
    const newAccessToken = res.body.accessToken;
    const newRefreshToken = res.body.refreshToken;

    const response = await request(app).delete("/comments/" + newCommentId)
      .set({ 
        "Authorization": "Bearer " + newAccessToken,
        "x-refresh-token": newRefreshToken
      });
    expect(response.statusCode).toBe(403); // This should now work as we're trying to delete an existing comment
  });

  test("Test Delete Comment with invalid ID", async () => {
    const response = await request(app).delete("/comments/invalidcommentid")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Delete non-existent Comment", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).delete("/comments/" + nonExistentId)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      });
    expect(response.statusCode).toBe(404);
  });

  test("Test Update Comment with invalid data", async () => {
    // First create a valid comment
    const createResponse = await request(app).post("/comments")
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        content: "Valid comment",
        postId: postId
      });
    expect(createResponse.statusCode).toBe(200);
    const commentToUpdate = createResponse.body._id;

    // Try to update with invalid data to trigger validation error
    const response = await request(app).put("/comments/" + commentToUpdate)
      .set({ 
        "Authorization": "Bearer " + testUser.accessToken,
        "x-refresh-token": testUser.refreshToken
      })
      .send({
        content: "" // Empty content should trigger validation error
      });
    expect(response.statusCode).toBe(400); // Should trigger validation error
  });

});