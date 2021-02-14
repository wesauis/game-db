import { Offer, OfferSearcher } from "./deps.ts";
import { readJSON, writeJSON } from "./utils/json.ts";

export type SearchResults = Record<string, Offer[]>;

export type LastRuns = Record<string, number>;

type Search = {
  id: string;
  search: Promise<Offer[]>;
};

/** Searches and cache offers
 * 
 * @param searchers all avaliable searcher by id
 * @param limit OfferSearcher limit arg
 * @param force true if shoud run all searchers
 * @param timeBetweenSearches time to wait to run the searcher again
 * @param lastRunsFilePath
 * @param resultsFilePath 
 */
export async function searchOffers(
  searchers: Record<string, OfferSearcher>,
  force: boolean,
  timeBetweenSearches: number,
  lastRunsFilePath: string,
  resultsFilePath: string,
  limit?: number,
): Promise<SearchResults> {
  const searchersIds = Object.keys(searchers);
  const lastRuns = readJSON<LastRuns>(lastRunsFilePath) || {};

  // queue all searches
  // if runAll use all searchers
  // else use only searchers that are out of the timeBetweenSearches interval
  const now = Date.now();
  const searches: Search[] = [];
  for (const id of searchersIds) {
    const lastRun = lastRuns[id];
    const canRun = !lastRun || lastRun + timeBetweenSearches < now;

    if (force || canRun) {
      searches.push({
        id,
        search: searchers[id](limit),
      });
    }
  }

  // wait all queued searches to end
  const results: SearchResults = {};
  for (const { id, search } of searches) {
    const offers = await search;
    if (offers.length > 0) {
      results[id] = offers;
    }
  }

  // update lastRuns
  const searchersIdsRun = Object.keys(results);
  for (const id of searchersIdsRun) {
    lastRuns[id] = now;
  }
  writeJSON<LastRuns>(lastRunsFilePath, lastRuns, { create: true });

  // get results from searchers that whore not run from cache
  const cachedResults = readJSON<SearchResults>(resultsFilePath) || {};
  for (const id of searchersIds) {
    if (!searchersIdsRun.includes(id)) {
      results[id] = cachedResults[id] || [];
    }
  }

  // update the cache
  writeJSON<SearchResults>(resultsFilePath, results, { create: true });
  return results;
}
