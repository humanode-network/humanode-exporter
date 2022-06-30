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

  new Gauge({
    name: "humanode_rpc_transactions_per_second",
    help: "transactions per second based on last 2 blocks",
    async collect() {
      const lastBlock = await api.rpc.chain.getBlock();
      const prevBlock = await api.rpc.chain.getBlock(lastBlock.block.header.parentHash);

      const timestampInLastBlock = parseInt(lastBlock.block.extrinsics[0].method.args[0].toString());
      const timestampInPrevBlock = parseInt(prevBlock.block.extrinsics[0].method.args[0].toString());

      const extrinsicsInLastBlock = lastBlock.block.extrinsics.length;
      const gapInSeconds = (timestampInLastBlock - timestampInPrevBlock) / 1000;
      const tps = extrinsicsInLastBlock / gapInSeconds;

      this.set(tps);
    },
  });
};
