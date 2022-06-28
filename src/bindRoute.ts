import { Express } from "express";
import { register } from "prom-client";

export default (app: Express) => {
  app.get("/metrics", async (_req, res) => {
    try {
      res.set("Content-Type", register.contentType);

      res.end(await register.metrics());
    } catch (err) {
      res.status(500).end("" + err);
    }
  });
};
