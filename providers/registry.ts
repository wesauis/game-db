import type { GameOffer } from "../types/types.d.ts";
import EpicStore from "./EpicStore.ts";
import EpicStoreFree from "./EpicStoreFree.ts";
import GoG from "./GoG.ts";
import GoGFree from "./GoGFree.ts";
import Steam from "./Steam.ts";

const providers = {
  EpicStore,
  EpicStoreFree,
  Steam,
  GoG,
  GoGFree,
};

export type RegisteredProviders = keyof typeof providers;

type ProviderRegistry = { [key: string]: () => Promise<GameOffer[]> };

export default providers as ProviderRegistry;
