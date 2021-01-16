import { disableLogger } from "./logging/logger.ts";
import GoG from "./providers/GoG.ts";
import GameOffer from "./types/GameOffer.d.ts";
import { GameOfferProvider } from "./types/GameOfferProvider.d.ts";

export const providers = {
  free: {
    "gog": new GoG("free"),
  },
  discounted: {
    "gog": new GoG("discounted"),
  },
};

export type RegisteredProviders =
  & keyof typeof providers.free
  & keyof typeof providers.discounted;

async function queryOffers(
  providers: GameOfferProvider[],
): Promise<GameOffer[]> {
  return await Promise.all(
    providers.map((provider) => provider.query()),
  ) // join the results
    .then((offers) => offers.flat());
}

if (import.meta.main) {
  let spaces: 2 | undefined = 2;

  if (Deno.args.includes("--help")) {
    console.log(
      `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
    --no-logging    disable logger
    --raw           dont prettify json
    --free          use free games providers
    --discounted    use free games providers
    --help          show this help message`,
    );

    Deno.exit(0);
  }

  if (Deno.args.includes("--no-logging")) disableLogger();
  if (Deno.args.includes("--raw")) spaces = undefined;

  const providers_: GameOfferProvider[] = [];
  if (Deno.args.includes("--free")) {
    providers_.push(...Object.values(providers.free));
  }
  if (Deno.args.includes("--discounted")) {
    providers_.push(...Object.values(providers.discounted));
  }
  if (providers_.length === 0) {
    providers_.push(
      ...Object.values(providers.free),
      ...Object.values(providers.discounted),
    );
  }

  console.log(JSON.stringify(await queryOffers(providers_), undefined, spaces));
}
