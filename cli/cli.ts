if (!import.meta.main) throw new Error("cli only");

import { colors, parseArgs, searchers } from "./deps.ts";
import { tableHTML } from "./formatters/table-html.ts";
import { table } from "./formatters/table.ts";
import { removeDelayed } from "./persistance/delays.ts";
import { searchOffers } from "./utils/search-offers.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db ${colors.gray("[OPTIONS]")}

query offers and free games and show them

${colors.gray("OPTIONS:")}
  --help          show this help message
  --json          prints raw json to stdout
  --html          prints html to stdout
  --run-all       run all registered providers

${colors.gray("ENVIRONMENT:")}
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const args = parseArgs(Deno.args, {
  boolean: ["help", "json", "html", "run-all"] as const,
  unknown(arg) {
    console.warn(`unknown argument: '${arg}', use --help for help`);

    Deno.exit(1);
  },
});

if (args.help) showHelpAndExit();

const results = await searchOffers(removeDelayed(searchers));
// TODO cache the results and use the cached for the providers that are not used
const offers = Object
  .values(results)
  .flat()
  // order: free-forever, 100 - 0
  .sort((offer0, offer1) => {
    const p0 = !offer0.price ? 101 : offer0.discount?.discountPercentage || 100;
    const p1 = !offer1.price ? 101 : offer1.discount?.discountPercentage || 100;

    return p1 - p0;
  });

if (args.json) {
  console.log(JSON.stringify(offers));
  Deno.exit(0);
}

if (!offers.length) {
  console.log("no games found");
  Deno.exit(0);
}

if (args.html) {
  for (const line of tableHTML(offers)) console.log(line);
} else {
  for (const line of table(offers)) console.log(line);
}
