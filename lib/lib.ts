import providers from "./provider-registry.ts";
import { Offer } from "./types/Offer.d.ts";

export { providers };
export type { Offer };

/** List all registered provider categories */
export function listCategories(): Set<string> {
  return new Set(providers
    .map((provider) => provider.category));
}

/** List all registered provider names */
export function listNames(): Set<string> {
  return new Set(providers
    .map((provider) => provider.name));
}

/** Query all offers that math the filter */
export async function queryOffers(
  lastRun: Date,
  force = false,
  categories?: string[],
  names?: string[],
): Promise<Offer[]> {
  let queries = providers;

  if (categories) {
    queries = queries
      .filter((query) => categories.includes(query.category));
  }

  if (names) {
    queries = queries
      .filter((query) => names.includes(query.name));
  }

  const promises = queries
    .map((provider) => provider.query(lastRun, force));
  return (await Promise.all(promises)).flat();
}
