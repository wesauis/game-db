if (!import.meta.main) throw new Error("cli only");

import { Args } from "https://deno.land/std@0.84.0/flags/mod.ts";
import logger, { Logger } from "../log/logger.ts";
import { colors, gamedb, parseArgs } from "./deps.ts";
import Table from "./Table.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
  --help          show this help message
  --debug         enables logger
  --json          json mode: prints raw json to stdout
  --categories    categories to use separated by comma
                  avaliable categories: ${
      [...gamedb.listCategories()].join(", ")
    }
                  example: \`--categories catg1,catg2\`
  --providers     provider names to use separated by comma
                  avaliable providers: ${[...gamedb.listNames()].join(", ")}
                  example: \`--providers name1,name2\`

Env:
  NO_COLOR        disable colors`,
  );

  Deno.exit(0);
}

const args = parseArgs(Deno.args, {
  boolean: ["help", "json", "debug"],
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

if (!args.debug) Logger.ENABLED = false;
if (args.help) showHelpAndExit();

const categories = args.categories?.split(",");
const providers = args.providers?.split(",");

const games = await gamedb.queryOffers(categories, providers);

if (args.json) {
  console.log(JSON.stringify(games));
  Deno.exit(0);
}

/** 
 * Given a value and a discount percentage, colorizes and formats the number.
 * 
 * @param value 
 * @param percentage 
 * @returns the formatted number
 */
function colorize(value = 0, percentage = 100): string {
  if (percentage >= 100) {
    return colors.rgb24("free", 0x00ff00);
  }

  // scalles the value from 0-100 to 0-255
  const scalled = Math.floor(Math.max(percentage * 2.55, 0));

  // gets a color in the range from red to green
  const r = 256 - scalled;
  const g = scalled;
  const b = 0;

  // xx.xx (xx%)
  return `${value.toFixed(2)} ${colors.rgb24(`-${percentage}%`, { r, g, b })}`;
}

const table = new Table({
  "Title": undefined,
  "Price": undefined,
  "Link": { align: "none", normalize: false },
});

games
  .filter((o) => o.price?.discount !== 0)
  .sort((o0, o1) => (o1.price?.discount || 100) - (o0.price?.discount || 100))
  .forEach((offer) => {
    const title = offer.title;
    const value = colorize(offer.price?.final, offer.price?.discount);

    table.add([title, value, offer.link]);
  });

table.render();
