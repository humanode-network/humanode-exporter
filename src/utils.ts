import type { StorageKey } from "@polkadot/types";
import type { AnyTuple } from "@polkadot/types-codec/types";

type PagintatedFn = <A extends AnyTuple>(
  startKey: undefined | string
) => Promise<StorageKey<A>[]>;

export const countPaginated = async (query: PagintatedFn): Promise<number> => {
  let total = 0;
  let startKey: undefined | any = undefined;

  while (true) {
    const keys = await query(startKey);
    const len = keys.length;
    if (len === 0) {
      break;
    }
    total += len;
    startKey = keys[len - 1].toString();
  }

  return total;
};
