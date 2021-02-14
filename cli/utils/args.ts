import { parseArgs as parse } from "https://github.com/wesauis/deno-typed-parse-args/raw/0.1.0/mod.ts";

export type Args = {
  help: boolean;
  html: boolean;
  force: boolean;
  free: boolean;
  discounted: boolean;
  json: ReturnType<typeof _json>;
  searcherIdMatch: ReturnType<typeof _searcherIdMatch>;
  endingms: ReturnType<typeof _endingms>;
  bestOffers: ReturnType<typeof _bestOffers>;
};

/** Return the parsed `Deno.args` */
export function parseArgs(defaults: {
  endingms: Parameters<typeof _endingms>[1];
  bestOffers: Parameters<typeof _bestOffers>[1];
}): Args {
  const args = parse(Deno.args, {
    boolean: ["help", "html", "force", "free", "discounted"] as const,
    string: ["json", "searcher-id-match", "ending", "best-offers"] as const,
    unknown(arg) {
      console.error(`unknown argument: ${arg}`);
      Deno.exit(1);
    },
  });

  try {
    return {
      help: args["help"],
      html: args["html"],
      force: args["force"],
      free: args["free"],
      discounted: args["discounted"],
      json: _json(args["json"]),
      searcherIdMatch: _searcherIdMatch(args["searcher-id-match"]),
      endingms: _endingms(args["ending"], defaults.endingms),
      bestOffers: _bestOffers(args["best-offers"], defaults.bestOffers),
    };
  } catch (err) {
    if (err instanceof InvalidArgument) {
      console.error(err.message);
      Deno.exit(1);
    }
    throw err;
  }
}

export class InvalidArgument extends Error {
  /**
   * @param def the definition of the argument. ex `--help` or `--name <name>`
   * @param error what went wrong. ex: `required argument name not found`
   */
  constructor(def: string, error: string) {
    super(`${def}\n ↪ ${error}`);
  }
}

export function _json(arg: string | undefined): undefined | "raw" | "pretty" {
  switch (arg) {
    case undefined:
      return undefined;
    case "":
    case "raw":
      return "raw";
    case "pretty":
      return "pretty";
    default:
      throw new InvalidArgument(
        "--json [raw|pretty]",
        `\`${arg}\` is not a valid option for \`--json\``,
      );
  }
}

export function _searcherIdMatch(arg: string | undefined): RegExp | undefined {
  if (arg == null) return undefined;

  try {
    if (arg.length === 0) throw new SyntaxError();

    return new RegExp(arg);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new InvalidArgument(
        "--searcher-id-match <regex>",
        `\`${arg}\` is not a valid regex`,
      );
    }

    throw err;
  }
}

export function _endingms(
  arg: string | undefined,
  default_: number,
): number | undefined {
  if (arg == null) return undefined;

  if (!arg) return default_;

  const ms = Number(arg);

  if (isNaN(ms)) {
    throw new InvalidArgument(
      "--ending [ms]",
      `\`${arg}\` is not a number`,
    );
  }

  return ms;
}

export function _bestOffers(
  arg: string | undefined,
  default_: [percentage?: number, amount?: number],
): undefined | [percentage?: number, amount?: number] {
  if (!arg) return default_;

  if (arg === "hide") {
    return undefined;
  }

  const regex = /^(0|[1-9][0-9]?|100)?(,\d+(\.\d+)?)?$/;
  if (regex.test(arg)) {
    const [percentage, amount] = arg.split(",");
    return [
      percentage ? Number(percentage) : undefined,
      amount ? Number(amount) : undefined,
    ];
  } else {
    throw new InvalidArgument(
      "--best-offers [hide|([percentage][,amount])]",
      `\`${arg}\` is not a number from 0 to 100 with/or a comma and a number`,
    );
  }
}
