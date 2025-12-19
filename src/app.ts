import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
// import fastifySwaggerUi from "@fastify/swagger-ui";
import { createCourseRoute } from "../src/routes/create-course.ts";
import { getCoursesRoute } from "../src/routes/get-courses.ts";
import { getCourseByIdRoute } from "../src/routes/get-course-by-id.ts";
import { loginRoute } from "./routes/login.ts";

const server = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Desafio NodeJS",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "deepSpace",
    },
  });
}

// server.register(fastifySwaggerUi, {
//   routePrefix: "/docs",
// });

server.register(createCourseRoute);
server.register(getCoursesRoute);
server.register(getCourseByIdRoute);
server.register(loginRoute);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

export { server };
