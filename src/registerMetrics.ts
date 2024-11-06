import { ApiPromise } from "@polkadot/api";
import { Gauge } from "prom-client";
import { countPaginated } from "./utils";

export default (api: ApiPromise) => {
  if (typeof api?.query?.session?.validators === "function") {
    new Gauge({
      name: "humanode_state_session_validators_count",
      help: "count of session validators",
      async collect() {
        const validators = await api.query.session.validators();
        this.set((validators.toJSON() as string[]).length);
      },
    });
  }

  if (typeof api?.query?.bioauth?.activeAuthentications === "function") {
    new Gauge({
      name: "humanode_state_bioauth_active_authentications_count",
      help: "count of bioauth active authentications",
      async collect() {
        const activeAuthentications =
          await api.query.bioauth.activeAuthentications();
        this.set((activeAuthentications.toJSON() as string[]).length);
      },
    });
  }

  if (typeof api?.query?.bioauth?.consumedAuthTicketNonces === "function") {
    new Gauge({
      name: "humanode_state_bioauth_consumed_auth_ticket_nonces_count",
      help: "count of consumed auth ticket nonces",
      async collect() {
        const consumedAuthTicketNonces =
          await api.query.bioauth.consumedAuthTicketNonces();
        this.set((consumedAuthTicketNonces.toJSON() as string[]).length);
      },
    });
  }

  if (typeof api?.rpc?.chain?.getBlock === "function") {
    new Gauge({
      name: "humanode_rpc_last_block_extrinsics_count",
      help: "total number of extrinsics in the best block",
      async collect() {
        const block = await api.rpc.chain.getBlock();
        this.set(block.block.extrinsics.length);
      },
    });
  }

  if (typeof api?.query?.session?.nextKeys === "function") {
    new Gauge({
      name: "humanode_state_session_next_keys_count",
      help: "count of the session keys to use in the next session",
      async collect() {
        const count = await countPaginated((startKey) =>
          api.query.session.nextKeys.keysPaged({
            args: [],
            pageSize: 1000,
            startKey,
          })
        );
        this.set(count);
      },
    });
  }

  if (typeof api?.query?.offences?.reports === "function") {
    new Gauge({
      name: "humanode_state_offences_reports_count",
      help: "count of the offence reports",
      async collect() {
        const count = await countPaginated((startKey) =>
          api.query.offences.reports.keysPaged({
            args: [],
            pageSize: 1000,
            startKey,
          })
        );
        this.set(count);
      },
    });
  }
};
