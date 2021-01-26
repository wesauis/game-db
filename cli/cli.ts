if (!import.meta.main) throw new Error("cli only");

import { Args } from "https://deno.land/std@0.84.0/flags/mod.ts";
import logger, { Logger } from "../log/logger.ts";
import { colors, gamedb, parseArgs } from "./deps.ts";

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
interface Options {
  align?: "left" | "right" | "none";
}

interface ColumnOptions {
  [index: number]: Options | undefined;
}

interface HeaderColumnOptions {
  [key: string]: Options | undefined;
}

class Table {
  #widths: number[] = [];
  #config: ColumnOptions = {};

  #header: string[] | undefined;
  #rows: string[][] = [];
  constructor(header?: string[] | HeaderColumnOptions) {
    if (Array.isArray(header)) {
      this.#header = Table.normalize(header);
      this.updateWidths(this.#header);
    } else if (typeof header === "object") {
      this.#header = Table.normalize(Object.keys(header));
      this.updateWidths(this.#header);

      Object.values(header).forEach((value, index) => {
        this.#config[index] = value;
      });
    }
  }

  /**
   * Given an array of strings, remove non-ascii characters except \x1b
   * 
   * @param row
   */
  private static normalize(row: string[]): string[] {
    // deno-lint-ignore no-control-regex
    return row.map((value) => value.replaceAll(/[^\x1b -~]/g, ""));
  }

  private static width(value: string): number {
    // deno-lint-ignore no-control-regex
    return value.replace(/\x1b\[[^\x1b]+m/g, "").length;
  }

  private updateWidths(row: string[]): void {
    row.forEach((value, index) => {
      // ignore console colors like ansi rbg (\x1b[38;2;40;177;249m)
      const width = Table.width(value) + 1;

      if (!this.#widths[index] || this.#widths[index] < width) {
        this.#widths[index] = width;
      }
    });
  }

  add(row: string[]): void {
    const normalized = Table.normalize(row);

    this.#rows.push(normalized);
    this.updateWidths(normalized);
  }

  /**
   * Sorts the rows of the table
   * 
   * @param compareFn 
   * @param render 
   */
  sort(compareFn?: ((a: string[], b: string[]) => number)): void {
    this.#rows = this.#rows.sort(compareFn);
  }

  private static format(value: string, width: number, opts: Options) {
    const { align = "left" } = opts;

    const spaces = (len: number) => new Array(Math.max(len, 0)).join(" ");

    switch (align) {
      case "left":
        return value + spaces(width - Table.width(value));
      case "right":
        return spaces(width - Table.width(value)) + value;
      case "none":
        return value;
    }
  }

  render(): void {
    const formatter = (value: string, index: number) =>
      Table.format(
        value,
        this.#widths[index],
        this.#config[index] || {},
      );

    if (this.#header) {
      console.log(colors.bold(this.#header.map(formatter).join(" ")));
    }

    this.#rows.forEach((row) => {
      console.log(row.map(formatter).join(" "));
    });
  }
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

  // scalles the value from 0-100 to 255-0
  const scalled = Math.floor(256 - Math.max(percentage * 2.55, 0));

  // gets a color in the range from red to green
  const r = scalled;
  const g = 256 - scalled;
  const b = 0;

  // xx.xx (xx%)
  return `${value.toFixed(2)} ${colors.rgb24(`-${percentage}%`, { r, g, b })}`;
}

const table = new Table({
  "Title": undefined,
  "Price": undefined,
  "Link": { align: "none" },
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
