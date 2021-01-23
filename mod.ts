import { parseArgs } from "./deps.ts";
import providers from "./provider-registry.ts";
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
  const args = parseArgs(Deno.args, {
    boolean: ["help", "json"],
  });

  if (args["help"]) {
    console.log(
      `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
    --help          show this help message
    --raw           dont prettify json
    
Env:
    NO_COLOR        disable colors
    NO_LOGGER       disable logger`,
    );

    Deno.exit(0);
  }

  const games = await queryOffers(["free"], ["epic-store"]);

  if (args["json"]) {
    console.log(JSON.stringify(games));
  } else {
    throw new Error("unimplemented yet...");
  }

  /**
   * TODO: 
   * - better args for raw and logging
   * - select providers to query by name and/or category
   * - options raw and raw-pretty
   * - default output shout be just updates
   * - docs
   */
}
