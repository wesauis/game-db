import { cyan, red, yellow } from "../deps.ts";
import { STATUS_CODES } from "./status.ts";

let enabled = true;
export function disableLogger() {
  enabled = false;
}

export class Logger {
  constructor(private readonly prefix: string) {}

  info(arg1: unknown, ...args: unknown[]) {
    if (enabled) console.info(cyan(this.prefix), arg1, ...args);
  }

  warn(arg1: unknown, ...args: unknown[]) {
    if (enabled) console.warn(yellow(this.prefix), arg1, ...args);
  }

  error(arg1: unknown, ...args: unknown[]) {
    if (enabled) console.error(red(this.prefix), arg1, ...args);
  }

  requestError(error: Response | Error) {
    if (!enabled) return;

    const prefix = red(this.prefix);

    if ("status" in error) {
      console.error(
        prefix,
        "request error - ",
        STATUS_CODES[error.status] || error.status,
      );
    } else {
      console.error(prefix, error);
    }
  }
}

export default new Logger("game-db");
