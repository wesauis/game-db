import { ObjectHash, Offer, searchers } from "../deps.ts";
import { HashMap, toHashMap } from "./hash-map.ts";
import { readJSON } from "./json.ts";
import { paths } from "./paths.ts";
import { filterDelayed } from "./search-delays.ts";

type SearchResults = Record<string, Offer[]>;

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

type SortedOffers = {
  /** all offers mapped by hash */
  _: HashMap<Offer>;
  /** offers that will end on the next X time */
  ending: ObjectHash[];
  /** offer: foundAt, or time expired */
  news: Record<ObjectHash, number>;
  /** best offers, classified by how high is the discount (ex: 100%) and/or how mutch is the discount (ex: USD 250,00) */
  bestDeals: ObjectHash[];
  /** all discounted offers */
  discounted: ObjectHash[];
  /** all free-always offers */
  free: ObjectHash[];
};

function sortOffers(
  offers: HashMap<Offer>,
  last: SortedOffers,
  { newTTL, endingTTE }: {
    /** time to last of new offers */
    newTTL: number;
    /** how close to the end for an offer to be ending */
    endingTTE: number;
  },
): SortedOffers {
  const ending: SortedOffers["ending"] = [];
  const news: SortedOffers["news"] = {};
  const bestDeals: SortedOffers["bestDeals"] = [];
  const discounted: SortedOffers["discounted"] = [];
  const free: SortedOffers["free"] = [];

  for (const hash in offers) {
    const offer = offers[hash];
    const isDiscounted = offer.price > 0;
    const now = Date.now();

    // news - just found
    if (last._[hash] == null) {
      news[hash] = now;
    }

    // news - still on the 'new interval'
    if (last.news[hash] && now - last.news[hash] < newTTL) {
      news[hash] = last.news[hash];
    }

    if (isDiscounted) {
      const { endDate, discountPercentage, discountPrice } = offer.discount!;

      // ending
      if (endDate && now - endDate.getTime() < endingTTE) {
        ending.push(hash);
      }

      // bestDeals
      if (discountPercentage > 85 || offer.price - discountPrice > 99) {
        bestDeals.push(hash);
      }

      // discounted
      discounted.push(hash);
    } else {
      // free
      free.push(hash);
    }
  }

  return {
    _: offers,
    ending,
    news,
    bestDeals,
    free,
    discounted,
  };
}

export type SortedSearchResults = Record<string, SortedOffers>;

const RESULT_CACHE = `${paths.cache}/result-cache.json`;

const sortedOffersDefaults = {
  _: {},
  ending: [],
  news: {},
  bestDeals: [],
  discounted: [],
  free: [],
};

export async function searchSortAndCacheOffers(
  runAll: boolean,
): Promise<SortedSearchResults> {
  const allIds = Object.keys(searchers);

  const results = await searchOffers(runAll ? allIds : filterDelayed(allIds));

  const runIds = Object.keys(results);

  const sortedResultsCache = readJSON<SortedSearchResults>(RESULT_CACHE) || {};

  const sortedResults: SortedSearchResults = {};
  for (const id of runIds) {
    const offersMap = toHashMap(results[id]);

    const sortedCache = sortedResultsCache[id] || sortedOffersDefaults;

    sortedResults[id] = sortOffers(
      offersMap,
      sortedCache,
      {
        // 5 days
        newTTL: 5 * 24 * 60 * 60 * 1000,
        // 36 hours
        endingTTE: 36 * 60 * 60 * 1000,
      },
    );
  }

  const notRun = allIds.filter((id) => !runIds.includes(id));
  for (const id of notRun) {
    sortedResults[id] = sortedResultsCache[id] || sortedOffersDefaults;
  }

  return sortedResults;
}
