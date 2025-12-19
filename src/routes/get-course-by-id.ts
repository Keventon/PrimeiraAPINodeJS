import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import z from "zod";
import { eq } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { getAuthenticatedUserFromRequest } from "../utils/get-authenticated-user-from-request.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      preHandler: [checkRequestJWT],
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        tags: ["courses"],
        summary: "Retorna um curso pelo ID",
        response: {
          200: z
            .object({
              course: z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              }),
            })
            .describe("Curso retornado com sucesso!"),
          404: z
            .object({
              error: z.string(),
            })
            .describe("Curso não encontrado"),
        },
      },
    },
    async (request, reply) => {
      const user = getAuthenticatedUserFromRequest(request);

      const courseId = request.params.id;
      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId))
        .limit(1);

      if (result.length > 0) {
        return reply.send({ course: result[0] });
      } else {
        return reply.status(404).send({ error: "Curso não encontrado" });
      }
    }
  );
};
