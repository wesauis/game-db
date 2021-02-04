if (!import.meta.main) throw new Error("cli only");

import { Args, colors, parseArgs, providers } from "./deps.ts";
import { tableHTML } from "./formatters/table-html.ts";
import { table } from "./formatters/table.ts";
import * as delays from "./persistance/delays.ts";
import { queryOffers } from "./query-offers.ts";

function showHelpAndExit() {
  function joinUnique<T>(arr: T[], field: keyof T, separator = ", "): string {
    return [...new Set(arr.map((obj) => obj[field]))].join(separator);
  }

  console.log(
    `Usage: game-db ${colors.gray("[OPTIONS]")}

query offers and free games and show them

${colors.gray("OPTIONS:")}
  --help          show this help message
  --json          prints raw json to stdout
  --html          prints html to stdout
  --run-all       run all registered providers
  --categories <categories>
                  category filter, separated by comma
                  possible values: ${joinUnique(providers, "category")}
  --providers <provider-names>
                  provider names to use separated by comma
                  possible values: ${joinUnique(providers, "name")}

${colors.gray("ENVIRONMENT:")}
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const args = parseArgs(Deno.args, {
  boolean: ["help", "json", "html", "run-all"],
  string: ["categories", "providers"],
  unknown(arg) {
    console.warn(`unknown argument: '${arg}', use --help for help`);
  },
}) as Args & {
  help: boolean;
  json: boolean;
  html: boolean;
  "run-all": boolean;
  categories?: string;
  providers?: string;
};

if (args.help) showHelpAndExit();

let choosenProviders = providers;

const categories = args.categories?.split(",");
if (categories) {
  choosenProviders = providers.filter((provider) => {
    return provider.category in categories;
  });
}

const names = args.providers?.split(",");
if (names) {
  choosenProviders = providers.filter((provider) => {
    return provider.name in names;
  });
}

const lastRuns = delays.load();

const results = await queryOffers(
  choosenProviders,
  lastRuns,
  args["run-all"],
);

delays.update(lastRuns, results.providers);

if (args.json) {
  console.log(JSON.stringify(results));
  Deno.exit(0);
}

if (!results.offers.lenght) {
  console.log("no games found");
  Deno.exit(0);
}

const offers = Object
  .values(results.offers)
  .flat()
  // order: free-forever, 100 - 0
  .sort((offer0, offer1) => {
    const d0 = !offer0.price ? 101 : offer0.discount?.discountPercentage || 100;
    const d1 = !offer1.price ? 101 : offer1.discount?.discountPercentage || 100;

    return d1 - d0;
  });

if (args.html) {
  for (const line of tableHTML(offers)) console.log(line);
} else {
  for (const line of table(offers)) console.log(line);
}
