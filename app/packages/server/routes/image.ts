import { Sql } from "postgres";
import { Store, Lock } from "@sivic/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  CreatePayload,
  FindPayload,
  DeletePayload,
} from "@sivic/core/image";

export const ImageRoutes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: CreatePayload }>("/create", {}, async (req, reply) => {
      const res = await srv.create(req.body);
      reply.send(res);
    });
    app.post<{ Body: FindPayload }>("/find", {}, async (req, reply) => {
      const res = await srv.find(req.body);
      reply.send(res);
    });
    app.post<{ Body: DeletePayload }>("/delete", {}, async (req, reply) => {
      const res = await srv.delete(req.body);
      reply.send(res);
    });
    done();
  };
};
