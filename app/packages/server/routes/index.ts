import fastify, { FastifyPlugin } from "fastify";
import { Lock, Store } from "@sivic/core";
import path from "path";
import { WorkspaceRoutes } from "./workspace";
import { ImageRoutes } from "./image";
import { DetectRoutes } from "./detect";
import { BoxRoutes } from "./box";
import { PointRoutes } from "./point";
import { TrasnformRoutes } from "./transform";

import fastifyStatic from "fastify-static";

const urlRoutes: FastifyPlugin<{ prefix: string }> = function (
  app,
  opts,
  done
) {
  app.get("/image-store-url", {}, async (request) => {
    return process.env.IMAGE_STORE_URL;
  });
  done();
};

export const App = (args: { store: Store; lock: Lock }) => {
  const { store, lock } = args;
  const app = fastify({
    bodyLimit: 10048576,
    logger: true,
  });
  const prefix = path.join("/", process.env.PREFIX || "", "/api/v1");
  app.register(urlRoutes, { prefix });
  app.register(fastifyStatic, {
    root: "/srv/packages/web/dist",
  });
  app.register(WorkspaceRoutes({ store, lock }), {
    prefix: `${prefix}/workspace`,
  });
  app.register(ImageRoutes({ store, lock }), {
    prefix: `${prefix}/image`,
  });
  app.register(DetectRoutes({ store, lock }), {
    prefix: `${prefix}/detect`,
  });
  app.register(BoxRoutes({ store, lock }), {
    prefix: `${prefix}/box`,
  });
  app.register(PointRoutes({ store, lock }), {
    prefix: `${prefix}/point`,
  });
  app.register(TrasnformRoutes({ store, lock }), {
    prefix: `${prefix}/transform`,
  });
  app.ready(async () => {
    console.log(app.printRoutes());
  });
  return app;
};
