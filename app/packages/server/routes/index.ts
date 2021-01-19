import fastify, { FastifyPlugin } from "fastify";
import { Lock, Store } from "@sivic/core";
import path from "path";
import { WorkspaceRoutes } from "./workspace";
import fastifyStatic from "fastify-static";

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({
    bodyLimit: 10048576,
    logger: true,
  });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.get(`${prefix}/detection-api`, {}, async (req, rep) => {
    rep.send(process.env.DETECTION_API);
  });
  app.register(fastifyStatic, {
    root: "/srv/packages/web/dist",
  });
  app.register(WorkspaceRoutes({ store, lock }), {
    prefix: `${prefix}/box`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
