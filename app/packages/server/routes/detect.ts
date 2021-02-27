import { Sql } from "postgres";
import { Store, Lock } from "@sivic/core";
import { FastifyPlugin } from "fastify";


export const DetectRoutes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  return function (app, opts, done) {
    app.post<{ Body: DetectPayload }>("/box", {}, async (req, reply) => {
      // const res = await srv.create(req.body);
      reply.send([
        {
          x0:0.3,
          y0:0.4,
          x1:0.4,
          y1:0.5,
          confidence: 0.8,
        },
        {
          x0:0.5,
          y0:0.6,
          x1:0.6,
          y1:0.7,
          confidence: 0.5,
        },
      ]);
    });
    done();
  };
};

