import { assertEquals } from "https://deno.land/std@0.84.0/testing/asserts.ts";
import { Offer } from "./deps.ts";
import { LastRuns, searchOffers, SearchResults } from "./search-offers.ts";
import { readJSON } from "./utils/json.ts";

Deno.test("search offers", async () => {
  const tempDir = await Deno.makeTempDir({ prefix: "game-db" });

  const lastRunsFilePath = `${tempDir}/lastRuns.json`;
  const resultsFilePath = `${tempDir}/results.json`;

  const offers: Offer[] = [{
    title: "game",
    link: "http://0.0.0.0",
    price: 0,
  }];

  const searchResults = await searchOffers(
    { empty: () => Promise.resolve(offers) },
    true,
    /* 12 hours */ 0,
    lastRunsFilePath,
    resultsFilePath,
  );

  const expectedResults = { empty: offers };

  assertEquals(
    searchResults,
    expectedResults,
    "was run",
  );

  assertEquals(
    typeof readJSON<LastRuns>(lastRunsFilePath)?.empty,
    "number",
    "lastRuns file created and has the time",
  );

  assertEquals(
    readJSON<SearchResults>(resultsFilePath),
    expectedResults,
    "results cache created and has the offers",
  );
});
