import express from "express";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { register, Gauge, collectDefaultMetrics } from "prom-client";

const { RPC_URL, PORT = 3000 } = process.env;

if (!RPC_URL) {
  throw new Error("No provided RPC_URL");
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

const provider = new WsProvider(RPC_URL);
api = await ApiPromise.create({ provider });
app.listen(Number(PORT), "0.0.0.0");
