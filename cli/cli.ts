if (!import.meta.main) throw new Error("cli only");

import type { Args } from "./deps.ts";
import { parseArgs, providers } from "./deps.ts";
import { queryOffers } from "./query-offers.ts";
import { tableHTML } from "./table-html.ts";
import { table } from "./table.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
  --help          show this help message
  --json          prints raw json to stdout
  --html          prints the html to the terminal
                  example (windows powershell): \`game-db --html > $env:temp/game-db.html && start $env:temp/game-db.html\`
  --run-all       run all registered providers                
  --categories    categories to use separated by comma
                  avaliable categories: ${
      [...providers.map((provider) => provider.category)].join(", ")
    }
                  example: \`--categories catg1,catg2\`
  --providers     provider names to use separated by comma
                  avaliable providers: ${
      [...providers.map((provider) => provider.name)].join(", ")
    }
                  example: \`--providers name1,name2\`

Env:
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

const results = await queryOffers(choosenProviders, {}, args["run-all"]);

if (args.json) {
  console.log(JSON.stringify(results));
} else {
  const offers = Object
    .values(results.offers)
    .flat()
    // order: free-forever, 100 - 0
    .sort((offer0, offer1) => {
      const d0 = !offer0.price
        ? 101
        : offer0.discount?.discountPercentage || 100;
      const d1 = !offer1.price
        ? 101
        : offer1.discount?.discountPercentage || 100;

      return d1 - d0;
    });

  if (args.html) {
    for (const line of tableHTML(offers)) console.log(line);
  } else {
    for (const line of table(offers)) console.log(line);
  }
}
