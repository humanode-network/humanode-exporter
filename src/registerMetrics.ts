import { ApiPromise } from "@polkadot/api/promise";
import { Gauge } from "prom-client";

export default (api: ApiPromise) => {
  new Gauge({
    name: "humanode_state_session_validators_count",
    help: "count of session validators",
    async collect() {
      const validators = await api.query.session.validators();
      this.set((validators.toJSON() as string[]).length);
    },
  });

  new Gauge({
    name: "humanode_rpc_last_block_extrinsics_count",
    help: "total number of extrinsics in the best block",
    async collect() {
      const block = await api.rpc.chain.getBlock();
      this.set(block.block.extrinsics.length);
    },
  });
};
