import { disableLogger } from "./logging/logger.ts";
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
  let spaces: 2 | undefined = 2;

  if (Deno.args.includes("--help")) {
    console.log(
      `Usage: game-db [OPTIONS]

Options: 
    --no-logging    disable logger
    --raw           dont prettify json
    --help          show this help message`,
    );

    Deno.exit(0);
  }

  if (Deno.args.includes("--no-logging")) disableLogger();
  if (Deno.args.includes("--raw")) spaces = undefined;

  console.log(JSON.stringify(await queryOffers(), undefined, spaces));
}
