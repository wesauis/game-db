import GoG from "./providers/GoG.ts";
import GameOffer from "./types/GameOffer.d.ts";

export const providers = {
  "gog": new GoG(),
};

export type RegisteredProviders = keyof typeof providers;

async function queryOffers(): Promise<GameOffer[]> {
  return await Promise.all(
    Object.values(providers).map((provider) => provider.query()),
  ) // join the results
    .then((offers) => offers.flat())
    // order by discount, descending
    .then((offers) =>
      offers.sort((a, b) =>
        (b.price?.discount || 100) - (a.price?.discount || 100)
      )
    );
}

if (import.meta.main) {
  console.log(JSON.stringify(await queryOffers(), undefined, 2));
}
