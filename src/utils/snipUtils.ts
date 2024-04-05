import { env } from "~/env";
import { type Snip } from "~/pages";

export const getSnipEndUrl = (snip: Snip) => {
  return env.NEXT_PUBLIC_SNIP_BASE_URL + snip.short;
};
