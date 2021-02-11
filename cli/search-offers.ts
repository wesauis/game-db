import { Offer, searchers } from "./deps.ts";
import { paths } from "./paths.ts";
import { filterDelayed } from "./search-delays.ts";
import { readJSON, writeJSON } from "./utils/json.ts";

export type SearchResults = Record<string, Offer[]>;

async function searchOffers(toRun: string[]): Promise<SearchResults> {
  type SearcherID = keyof typeof searchers;
  const searches = toRun.map((id) => ({
    id,
    search: searchers[id as SearcherID](),
  }));

  const results: SearchResults = {};
  for (const { id, search } of searches) {
    const offers = await search;
    if (offers.length > 0) {
      results[id] = offers;
    }
  }
  return results;
}

const RESULT_CACHE = `${paths.cache}/results.json`;

export async function searchAndCacheOffers(
  runAll: boolean,
): Promise<SearchResults> {
  const allIds = Object.keys(searchers);

  const results = await searchOffers(runAll ? allIds : filterDelayed(allIds));

  const runIds = Object.keys(results);

  const cachedResults = readJSON<SearchResults>(RESULT_CACHE) || {};

  for (const id of allIds) {
    if (!runIds.includes(id)) {
      results[id] = cachedResults[id] || [];
    }
  }

  writeJSON<SearchResults>(RESULT_CACHE, results, { create: true });

  return results;
}
