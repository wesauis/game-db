import providers from "./provider-registry.ts";
import Offer from "./types/Offer.d.ts";

export { providers };
export type { Offer };

/**
 * list all registered provider categories
 */
export function listCategories(): Set<string> {
  return new Set(providers
    .map((provider) => provider.category));
}

/**
 * list all registered provider names
 */
export function listNames(): Set<string> {
  return new Set(providers
    .map((provider) => provider.name));
}

/**
 * query all offers that math the filter
 */
export async function queryOffers(
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

  const promises = queries.map((provider) =>
    provider
      .query()
      // remove non-promotions (0% discount)
      .then((offers) => offers.filter((offer) => offer.price?.discount !== 0))
  );

  const offers = (await Promise.all(promises)).flat();
  return offers;
}
