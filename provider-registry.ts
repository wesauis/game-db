import importDir from "./importDir.ts";
import { Logger } from "./logging/logger.ts";
import type GameOffer from "./types/GameOffer.d.ts";

const logger = new Logger("provider-registry");

export interface GameOfferProvider {
  readonly name: string;
  readonly category: string;
  query(): Promise<GameOffer[]>;
}

const providers: Set<GameOfferProvider> = new Set();

export function register(provider: GameOfferProvider) {
  providers.add(provider);
}

export async function loadProviders() {
  logger.info("importing providers");

  await importDir("./providers");

  logger.info("import completed");
}

export default providers;
