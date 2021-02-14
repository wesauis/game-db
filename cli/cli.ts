if (!import.meta.main) throw new Error("cli only");

import { existsSync } from "https://deno.land/std@0.85.0/fs/exists.ts";
import { appPaths, colors, searchers } from "./deps.ts";
import { tableHTML } from "./printers/table-html.ts";
import { table } from "./printers/table.ts";
import { searchOffers } from "./search-offers.ts";
import { parseArgs } from "./utils/args.ts";

const args = parseArgs({
  endingms: 36 * 60 * 60 * 1000,
  bestOffers: [90, 80],
});

if (args.help) {
  console.log(
    `Usage: game-db ${colors.gray("[OPTIONS]")}

find the best game offers from your terminal

${colors.gray("OPTIONS:")}
  --help                                        show this help message
  --html                                        prints html to stdout
  --force                                       run all registered providers
  --free                                        show all always free games
  --discounted                                  show all discounted offers
  --json [raw|pretty]                           prints json to stdout
                                                 ↪ raw: minified
                                                 ↪ pretty: 2 spaces indent
  --ending [ms]                                 show games that will end soon
                                                 ↪ ms: millisseconds to end, defaults to 36 hours
  --best-offers [hide|([percentage][,amount])]  show best offers, enabled by default
                                                 ↪ hide: disables
                                                 ↪ percentage: greater then this is a good offer, defaults to 90
                                                 ↪ amount: saved ammount, greater then this is a good offer, defaults to 80
  --searcher-id-match <regex>                   filters what provider to be used using a regex to test against the provider id

${colors.gray("ENVIRONMENT:")}
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const paths = appPaths("game-db");
if (!existsSync(paths.config)) {
  await Deno.mkdir(paths.config, { recursive: true });
}
if (!existsSync(paths.cache)) {
  await Deno.mkdir(paths.cache, { recursive: true });
}

const toRun = { ...searchers };
if (args.searcherIdMatch) {
  for (const id in toRun) {
    // remove searchers that doesn't match the regex
    if (!args.searcherIdMatch.test(id)) {
      delete toRun[id as keyof typeof toRun];
    }
  }
}

const searchResults = await searchOffers(
  toRun,
  args.force,
  /* 12 hours */ 43200000,
  `${paths.config}/lastRuns.json`,
  `${paths.cache}/results.json`,
);

// TODO args.bestOffers;
// TODO args.endingms;
// TODO args.discounted;
// TODO args.free;

if (args.json) {
  const spaces = args.json == "pretty" ? 2 : undefined;
  console.log(JSON.stringify(searchResults, undefined, spaces));
  Deno.exit(0);
}

if (args.html) {
  for (const line of tableHTML(searchResults)) console.log(line);
} else {
  for (const line of table(searchResults)) console.log(line);
}
