if (!import.meta.main) throw new Error("cli only");

import {
  Args,
  listCategories,
  listNames,
  parseArgs,
  queryOffers,
} from "./deps.ts";
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
  --categories    categories to use separated by comma
                  avaliable categories: ${[...listCategories()].join(", ")}
                  example: \`--categories catg1,catg2\`
  --providers     provider names to use separated by comma
                  avaliable providers: ${[...listNames()].join(", ")}
                  example: \`--providers name1,name2\`

Env:
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const args = parseArgs(Deno.args, {
  boolean: ["help", "json", "html"],
  string: ["categories", "providers"],
  unknown(arg) {
    console.warn(`unknown argument: '${arg}', use --help for help`);
  },
}) as Args & {
  help: boolean;
  json: boolean;
  categories?: string;
  providers?: string;
};

if (args.help) showHelpAndExit();

const categories = args.categories?.split(",");
const providers = args.providers?.split(",");

const offers = (await queryOffers(new Date(), true, categories, providers))
  // order: free-forever, 100 - 0
  .sort((offer0, offer1) => {
    const d0 = !offer0.price ? 101 : offer0.discount?.discountPercentage || 100;
    const d1 = !offer1.price ? 101 : offer1.discount?.discountPercentage || 100;

    return d1 - d0;
  });

if (args.json) {
  console.log(JSON.stringify(offers));
} else if (args.html) {
  for (const line of tableHTML(offers)) console.log(line);
} else {
  for (const line of table(offers)) console.log(line);
}
