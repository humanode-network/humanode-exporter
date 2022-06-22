import express from "express";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { register, Gauge, collectDefaultMetrics } from "prom-client";

const { SUBSTRATE_URL } = process.env;

if (!SUBSTRATE_URL) {
  throw new Error("No provided SUBSTRATE_URL");
}

collectDefaultMetrics({ prefix: "humanode_state_" });

new Gauge({
  name: "humanode_state_session_validators_count",
  help: "count of session validators",
  async collect() {
    const validators = await api.query.session.validators();
    this.set((validators.toJSON() as string[]).length);
  },
});

let api: ApiPromise;
let app = express();

app.get("/metrics", async (_req, res) => {
  try {
    res.set("Content-Type", register.contentType);

    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end("" + err);
  }
});

const provider = new WsProvider();
api = await ApiPromise.create({ provider });
app.listen(4001, "0.0.0.0");
