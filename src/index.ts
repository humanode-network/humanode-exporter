import express from "express";
import { ApiPromise } from "@polkadot/api/promise";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { collectDefaultMetrics } from "prom-client";
import registerMetrics from "./registerMetrics.js";
import routes from "./routes.js";

const { RPC_URL, PORT = 3000 } = process.env;

if (!RPC_URL) {
  throw new Error("No provided RPC_URL");
}

collectDefaultMetrics({ prefix: "humanode_exporter_" });

const app = express();
app.use(routes);

const provider = new WsProvider(RPC_URL);
const api = await ApiPromise.create({ provider });
registerMetrics(api);

app.listen(Number(PORT), "0.0.0.0");
