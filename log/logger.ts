import { cyan, red, yellow } from "https://deno.land/std@0.84.0/fmt/colors.ts";
import { STATUS_CODES } from "./status.ts";

export class Logger {
  static ENABLED = true;

  private readonly LABEL_INFO;
  private readonly LABEL_WARN;
  private readonly LABEL_ERROR;

  constructor(label: string) {
    label = label + ":";

    this.LABEL_INFO = cyan(label);
    this.LABEL_WARN = yellow(label);
    this.LABEL_ERROR = red(label);
  }

  info(arg1: unknown, ...args: unknown[]) {
    if (Logger.ENABLED) {
      console.info(this.LABEL_INFO, arg1, ...args);
    }
  }

  warn(arg1: unknown, ...args: unknown[]) {
    if (Logger.ENABLED) {
      console.warn(this.LABEL_WARN, arg1, ...args);
    }
  }

  error(arg1: unknown, ...args: unknown[]) {
    if (Logger.ENABLED) {
      console.error(this.LABEL_ERROR, arg1, ...args);
    }
  }

  requestError(error: Response | Error) {
    if (!Logger.ENABLED) return;

    if ("status" in error) {
      console.error(
        this.LABEL_ERROR,
        "request error - ",
        STATUS_CODES[error.status] || error.status,
      );
    } else {
      console.error(this.LABEL_ERROR, error);
    }
  }
}

export default new Logger("game-db");
