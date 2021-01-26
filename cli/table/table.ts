export interface Options {
  align?: "left" | "right" | "none";
  normalize?: boolean;
}

export interface ColumnOptions {
  [index: number]: Options | undefined;
}

export interface HeaderColumnOptions {
  [key: string]: Options | undefined;
}

export type Row = string[];

export abstract class Table {
  protected header: Row | undefined;
  protected rows: Row[] = [];
  protected readonly options: ColumnOptions;

  constructor(options?: HeaderColumnOptions | ColumnOptions) {
    if (options) {
      const header = Object.keys(options);

      // ColumnOptions
      if (typeof header[0] === "number") {
        this.options = options;
        // HeaderColumnOptions
      } else {
        this.header = Object.keys(options);

        this.options = {};
        Object.values(options).forEach((value, index) => {
          this.options[index] = value;
        });
      }
    } else {
      this.options = {};
    }
  }

  abstract normalize(value: string): string;

  normalizeRow(row: Row): Row {
    return row.map((value, index) => {
      const { normalize = true } = this.options[index] || {};

      return normalize ? this.normalize(value) : value;
    });
  }

  abstract add(row: Row): void;

  abstract render(): void;
}
