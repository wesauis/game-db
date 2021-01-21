import { disableLogger } from "./logging/logger.ts";
import providers, { loadProviders } from "./provider-registry.ts";
import GameOffer from "./types/GameOffer.d.ts";

async function queryOffers(
  categories?: string[],
  names?: string[],
): Promise<GameOffer[]> {
  let queries = Array.from(providers);

  if (categories) {
    queries = queries
      .filter((query) => categories.includes(query.category));
  }

  if (names) {
    queries = queries
      .filter((query) => names.includes(query.name));
  }

  return (await Promise
    .all(queries.map((provider) => provider.query())))
    .flat();
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

  await loadProviders();

  /**
   * TODO: 
   * - better args for raw and logging
   * - select providers to query by name and/or category
   * - options raw and raw-pretty
   * - default output shout be just updates
   * - docs
   */

  const games = await queryOffers(["free"], ["epic-store"]);
  console.log(JSON.stringify(games, undefined, spaces));
}
