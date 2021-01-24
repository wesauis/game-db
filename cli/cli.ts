if (!import.meta.main) throw new Error("cli only");

import {
  Args,
  parse as parseArgs,
} from "https://deno.land/std@0.84.0/flags/mod.ts";
import { listCategories, listNames, queryOffers } from "../lib/lib.ts";
import logger, { Logger } from "../log/logger.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
  --help          show this help message
  --json          json mode: prints raw json to stdout and disables logger
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
  boolean: ["help", "json"],
  string: ["categories", "providers"],
  unknown(arg) {
    logger.warn("unknown argument", arg, "\n");

    showHelpAndExit();
  },
}) as Args & {
  help: boolean;
  json: boolean;
  categories?: string;
  providers?: string;
};

if (args.help) showHelpAndExit();
if (args.json) Logger.ENABLED = false;

const categories = args.categories?.split(",");
const providers = args.providers?.split(",");

const games = await queryOffers(categories, providers);

if (args.json) console.log(JSON.stringify(games));
else {
  console.log(games);
}
