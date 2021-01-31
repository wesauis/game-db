import type { OfferProvider } from "../lib/offer-provider.ts";
import { QueryResult } from "./query-result.d.ts";

export async function queryOffers(
  providers: OfferProvider[],
  lastRuns: { [id: string]: Date },
  force = false,
): Promise<QueryResult> {
  const querys = providers
    .map((provider) => {
      const { id } = provider;

      const lastRun = lastRuns[id];
      const firstRun = lastRun == null;

      return {
        id,
        query: provider.query(
          lastRun || new Date(),
          // force run if first or force == true
          force || firstRun,
        ),
      };
    });

  const queryResult: QueryResult = { offers: {}, providers: [] };

  for (const { id, query } of querys) {
    const offers = await query;

    if (offers !== "DELAYED") {
      queryResult.offers[id] = offers;
      queryResult.providers.push(id);
    }
  }

  return queryResult;
}
