if (!import.meta.main) throw new Error("cli only");

import { colors, parseArgs } from "./deps.ts";
import { tableHTML } from "./printers/table-html.ts";
import { table } from "./printers/table.ts";
import { searchAndCacheOffers } from "./search-offers.ts";

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

const results = await searchAndCacheOffers(args["run-all"]);

if (args.json || args.jsonp) {
  const spaces = args.jsonp ? undefined : 2;
  console.log(JSON.stringify(results, undefined, spaces));
  Deno.exit(0);
}

if (args.html) {
  for (const line of tableHTML(results)) console.log(line);
} else {
  for (const line of table(results)) console.log(line);
}
