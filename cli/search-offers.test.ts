import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { Offer } from "./deps.ts";
import { LastRuns, searchOffers } from "./search-offers.ts";
import { readJSON } from "./utils/json.ts";

Deno.test("search and cache offers", async () => {
  const tempDir = await Deno.makeTempDir({ prefix: "game-db" });

  const lastRunsFilePath = `${tempDir}/lastRuns.json`;
  const resultsFilePath = `${tempDir}/results.json`;

  const offers: Offer[] = [{
    title: "game",
    link: "http://0.0.0.0",
    price: 0,
  }];

  const expectedResults = { empty: offers };

  assertEquals(
    await searchOffers(
      /* searcher with a known name and result */ {
        empty: (limit = Infinity) => {
          assertEquals(limit, 1, "limit was recieved by the searcher");
          return Promise.resolve(offers);
        },
      },
      /* runAll */ true,
      /* does not matter because of the runAll */ Infinity,
      /* place to store the lastRuns */ lastRunsFilePath,
      /* place to store the results for the next test */ resultsFilePath,
      /* limit to be used/tested */ 1,
    ),
    expectedResults,
    "was run",
  );

  assertEquals(
    typeof readJSON<LastRuns>(lastRunsFilePath)?.empty,
    "number",
    "lastRuns file created and has the time",
  );

  assertEquals(
    await searchOffers(
      /* searcher with a known name and result */ {
        empty: () => Promise.reject(new Error("")),
      },
      /* check the lastRuns.json */ false,
      /* shoud not run the provider */ Infinity,
      /* place to store the lastRuns */ lastRunsFilePath,
      /* place to store the results for the next test */ resultsFilePath,
    ),
    expectedResults,
    "results cache created, has the offers, and the cache was used instead of searching again",
  );
});
