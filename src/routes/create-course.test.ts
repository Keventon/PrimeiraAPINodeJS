import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { faker } from "@faker-js/faker";
import { makeAuthenticateUser } from "../tests/factories/make-user.ts";

test("Create a course", async () => {
  await server.ready();

  const { token } = await makeAuthenticateUser("manager");

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({
      title: faker.lorem.words(4),
    });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});
