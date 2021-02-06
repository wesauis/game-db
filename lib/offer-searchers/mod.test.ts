import { assert } from "https://deno.land/std@0.84.0/testing/asserts.ts";
import { OfferSearcher } from "../types/Offer.d.ts";
import * as searchers from "./mod.ts";

// limits results to 0 => so only the first page is used
const limit = 0;

// tests if each searcher returns at least result
// the test are done individually and dynamically generated
// this allows better debugging and maintenance
Object
  .entries(searchers as Record<string, OfferSearcher>)
  .forEach(([name, searcher]) => {
    const id = name
      .replace(/[A-Z][a-z]*$/, (substr) => `/${substr.toLowerCase()}`)
      .replace(/[A-Z][a-z]*/g, (substr) => `-${substr.toLowerCase()}`);

    Deno.test(`${id}: return a offer`, async () => {
      const results = await searcher(limit);

      assert(results.length > 0); // got some results
    });
  });
