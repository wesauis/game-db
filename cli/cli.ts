if (!import.meta.main) throw new Error("cli only");

import { parse as parseArgs } from "https://deno.land/std@0.84.0/flags/mod.ts";
import { queryOffers } from "../lib/lib.ts";

const args = parseArgs(Deno.args, {
  boolean: ["help", "json"],
});

if (args["help"]) {
  console.log(
    `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
  --help          show this help message
  
Env:
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const games = await queryOffers();

if (args["json"]) {
  console.log(JSON.stringify(games));
} else {
  throw new Error("unimplemented yet..., for now you need to use --json");
}
