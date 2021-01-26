import { colors } from "../deps.ts";
import { ColumnOptions, Options, Row, Table } from "./table.ts";

export default class TerminalTable extends Table {
  widths: number[] = [];

  /**
   * Removes non-ascii characters except \x1b (used for colors)
   * 
   * @param row
   */
  normalize(value: string): string {
    // deno-lint-ignore no-control-regex
    return value.replaceAll(/[^\x1b -~]/g, "");
  }

  /**
   * Return the width of the normalized string, ignoring \x1b colors
   * 
   * @param value 
   */
  private widthOf(value: string): number {
    // deno-lint-ignore no-control-regex
    return value.replace(/\x1b\[[^\x1b]+m/g, "").length;
  }

  private updateWidths(row: string[]): void {
    row.forEach((value, index) => {
      // +1 for the space between columns
      const width = this.widthOf(value) + 1;

      if (!this.widths[index] || this.widths[index] < width) {
        this.widths[index] = width;
      }
    });
  }

  add(row: Row): void {
    const normalized = this.normalizeRow(row);
    this.rows.push(normalized);
    this.updateWidths(normalized);
  }

  /**
   * Returns a string with given length made of spaces
   * 
   * @param len 
   */
  spaces(len: number) {
    return new Array(Math.max(len, 0)).join(" ");
  }

  format(value: string, width: number, opts: Options) {
    const { align = "left" } = opts;

    switch (align) {
      case "left":
        return value + this.spaces(width - this.widthOf(value));
      case "right":
        return this.spaces(width - this.widthOf(value)) + value;
      case "none":
        return value;
    }
  }

  formatRow(row: Row, overrides?: ColumnOptions): Row {
    return row.map((value: string, index: number) =>
      this.format(
        value,
        this.widths[index],
        overrides || this.options[index] || {},
      )
    );
  }

  render(): void {
    if (this.header) {
      console.log(colors.bold(this.formatRow(this.header, {}).join(" ")));
    }

    this.rows.forEach((row) => {
      console.log(this.formatRow(row).join(" "));
    });
  }
}
