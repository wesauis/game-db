import { parseArgs } from "./deps.ts";
import * as providers from './offer_providers/mod.ts'

if (import.meta.main) {
  const args = parseArgs(Deno.args)

  const offers = await Promise
    .all(Object 
      .values(providers)
      .map(provider => provider()))     // query all offers
    .then(offers => offers.flat())      // join the results
    .then(offers => offers              // order by discount, descending
      .sort((a, b) => b.price.discount - a.price.discount))

  console.log(offers)
}
