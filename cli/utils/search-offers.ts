import type { Offer, OfferSearcher } from "../deps.ts";

export async function searchOffers(
  searchers: Record<string, OfferSearcher>,
): Promise<Record<string, Offer[]>> {
  const querys = Object.entries(searchers)
    .map(([id, searcher]) => {
      return { id, search: searcher() };
    });

  const offers: Record<string, Offer[]> = {};

  for (const { id, search } of querys) {
    offers[id] = await search;
  }

  return offers;
}
