if (!import.meta.main) throw new Error("cli only");

import { existsSync } from "https://deno.land/std@0.85.0/fs/exists.ts";
import { appPaths, colors, parseArgs, searchers } from "./deps.ts";
import { tableHTML } from "./printers/table-html.ts";
import { table } from "./printers/table.ts";
import { searchOffers } from "./search-offers.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db ${colors.gray("[OPTIONS]")}

query offers and free games and show them

${colors.gray("OPTIONS:")}
  --help          show this help message
  --json          prints raw json to stdout
  --jsonp         prints prettified json to stdout
  --html          prints html to stdout
  --run-all       run all registered providers

${colors.gray("ENVIRONMENT:")}
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const args = parseArgs(Deno.args, {
  boolean: ["help", "json", "jsonp", "html", "run-all"] as const,
  unknown(arg) {
    console.warn(`unknown argument: '${arg}', use --help for help`);

    Deno.exit(1);
  },
});

if (args.help) showHelpAndExit();

const paths = appPaths("game-db");

if (!existsSync(paths.config)) {
  await Deno.mkdir(paths.config, { recursive: true });
}

if (!existsSync(paths.cache)) {
  await Deno.mkdir(paths.cache, { recursive: true });
}

const searchResults = await searchOffers(
  searchers,
  args["run-all"],
  /* 12 hours */ 43200000,
  `${paths.config}/lastRuns.json`,
  `${paths.cache}/results.json`,
);

if (args.json || args.jsonp) {
  const spaces = args.jsonp ? undefined : 2;
  console.log(JSON.stringify(searchResults, undefined, spaces));
  Deno.exit(0);
}

if (args.html) {
  for (const line of tableHTML(searchResults)) console.log(line);
} else {
  for (const line of table(searchResults)) console.log(line);
}
