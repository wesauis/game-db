if (!import.meta.main) throw new Error("cli only");

import { Args } from "https://deno.land/std@0.84.0/flags/mod.ts";
import logger, { Logger } from "../log/logger.ts";
import { colorize } from "./colorize.ts";
import { colors, gamedb, parseArgs } from "./deps.ts";
import HTMLTable from "./table/html.ts";
import TerminalTable from "./table/termainal.ts";

function showHelpAndExit() {
  console.log(
    `Usage: game-db [OPTIONS]

query games from all providers and output the json to the stdout

Options: 
  --help          show this help message
  --debug         enables logger
  --json          prints raw json to stdout
  --html          prints the html to the terminal (windows example: \`game-db --html > .html && start .html\`)
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
  boolean: ["help", "json", "debug", "html"],
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

const games = (await gamedb.queryOffers(categories, providers))
  // remove offers with discount === 0
  .filter((o) => o.price?.discount !== 0)
  // sorts by descending discount
  .sort((o0, o1) => (o1.price?.discount || 100) - (o0.price?.discount || 100));

if (args.json) {
  console.log(JSON.stringify(games));
} else if (args.html) {
  const table = new HTMLTable({
    "Title": undefined,
    "Price": { align: "right" },
  });

  games.forEach((offer) => {
    const title =
      `<a target="_blank" rel="noopener noreferrer" href="${offer.link}">${offer.title}</a>`;
    const { discount = 100, final = 0 } = offer.price || {};

    let value: string;
    if (offer.price?.discount === 100) {
      value = "free".fontcolor("#00ff00");
    } else {
      const [r, g, b] = colorize(final, discount);
      value = `${final.toFixed(2)} ${
        `-${discount}%`.fontcolor(`rgb(${r},${g},${b})`)
      }`;
    }

    table.add([title, value]);
  });

  table.render();
} else {
  const table = new TerminalTable({
    "Title": undefined,
    "Price": { align: "right" },
    "Link": { align: "none", normalize: false },
  });

  games.forEach((offer) => {
    const title = offer.title;

    const { discount = 100, final = 0 } = offer.price || {};

    let value: string;
    if (offer.price?.discount === 100) {
      value = colors.rgb24("free", 0x00ff00);
    } else {
      const [r, g, b] = colorize(final, discount);
      value = `${final.toFixed(2)} ${
        colors.rgb24(`-${discount}%`, { r, g, b })
      }`;
    }

    table.add([title, value, offer.link]);
  });

  table.render();
}
