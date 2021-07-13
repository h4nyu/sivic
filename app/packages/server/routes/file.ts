import { Sql } from "postgres";
import { Store, Lock } from "@sivic/core";
import { FastifyPlugin } from "fastify";
import {
  Service,
  FindPayload,
} from "@sivic/core/file";

export const Routes = (args: {
  store: Store;
  lock: Lock;
}): FastifyPlugin<{ prefix: string }> => {
  const { store, lock } = args;
  const srv = Service({ store, lock });
  return function (app, opts, done) {
    app.post<{ Body: FindPayload }>("/find", {}, async (req, reply) => {
      const res = await srv.find(req.body);
      reply.send(res);
    });
    done();
  };
};
export default Routes
