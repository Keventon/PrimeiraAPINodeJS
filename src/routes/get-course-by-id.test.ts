import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { faker } from "@faker-js/faker";
import { makeCourse } from "../tests/factories/make-course.ts";
import {
  makeAuthenticateUser,
  makeUser,
} from "../tests/factories/make-user.ts";

test("Get course by id", async () => {
  await server.ready();

  const { token } = await makeAuthenticateUser("student");
  const course = await makeCourse();

  const response = await request(server.server)
    .get(`/courses/${course.id}`)
    .set("Authorization", token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  });
});

test("return 404 if course not found", async () => {
  await server.ready();

  const { token } = await makeAuthenticateUser("student");

  const response = await request(server.server)
    .get(`/courses/b953798f-cea7-4b34-8593-79370b7cd7f3`)
    .set("Authorization", token);

  expect(response.status).toEqual(404);
});
