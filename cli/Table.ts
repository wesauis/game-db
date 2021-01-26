import { colors } from "./deps.ts";

interface Options {
  align?: "left" | "right" | "none";
  normalize?: boolean;
}

interface ColumnOptions {
  [index: number]: Options | undefined;
}

interface HeaderColumnOptions {
  [key: string]: Options | undefined;
}

/**
 * Removes non-ascii characters except \x1b (used for colors)
 * 
 * @param row
 */
function normalize(value: string): string {
  // deno-lint-ignore no-control-regex
  return value.replaceAll(/[^\x1b -~]/g, "");
}

/**
 * Return the width of the normalized string, ignoring \x1b colors
 * 
 * @param value 
 */
function widthOf(value: string): number {
  // deno-lint-ignore no-control-regex
  return value.replace(/\x1b\[[^\x1b]+m/g, "").length;
}

/**
 * Returns a string with given length made of spaces
 * 
 * @param len 
 */
function spaces(len: number) {
  return new Array(Math.max(len, 0)).join(" ");
}

function format(value: string, width: number, opts: Options) {
  const { align = "left" } = opts;

  switch (align) {
    case "left":
      return value + spaces(width - widthOf(value));
    case "right":
      return spaces(width - widthOf(value)) + value;
    case "none":
      return value;
  }
}

export default class Table {
  #widths: number[] = [];
  #config: ColumnOptions = {};

  #header: string[] | undefined;
  #rows: string[][] = [];
  constructor(header?: string[] | HeaderColumnOptions) {
    if (Array.isArray(header)) {
      this.#header = header.map(normalize);
      this.updateWidths(this.#header);
    } else if (typeof header === "object") {
      this.#header = Object.keys(header).map(normalize);
      this.updateWidths(this.#header);

      Object.values(header).forEach((value, index) => {
        this.#config[index] = value;
      });
    }
  }

  private updateWidths(row: string[]): void {
    row.forEach((value, index) => {
      // +1 for the space between columns
      const width = widthOf(value) + 1;

      if (!this.#widths[index] || this.#widths[index] < width) {
        this.#widths[index] = width;
      }
    });
  }

  add(row: string[]): void {
    const normalized = row.map((value, index) => {
      const { normalize: mustNormalize = true } = this.#config[index] || {};

      if (mustNormalize) return normalize(value);

      return value;
    });

    this.#rows.push(normalized);
    this.updateWidths(normalized);
  }

  render(): void {
    const formatter = (value: string, index: number) =>
      format(
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
