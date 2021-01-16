import { cyan, red, yellow } from "../deps.ts";
import { STATUS_CODES } from "./status.ts";

let enabled = true;
export function disableLogger() {
  enabled = false;
}

export type MetaEx = ImportMeta & {
  suffix?: string;
};

function labelFrom(meta: MetaEx) {
  const prefix = meta.url.substring(
    // filename
    meta.url.lastIndexOf("/") + 1,
    // remove .{js,ts}
    meta.url.length - 3,
  );

  const suffix = meta.suffix ? `/${meta.suffix}` : "";

  return `[${prefix}${suffix}]`;
}

function info(prefix: string, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.info(cyan(prefix), arg1, ...args);
}

function warn(prefix: string, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.warn(yellow(prefix), arg1, ...args);
}

function error(prefix: string, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.error(red(prefix), arg1, ...args);
}

function requestError(prefix: string, error: Response | Error) {
  if (!enabled) return;

  const prefix_ = red(prefix);

  if ("status" in error) {
    console.error(
      prefix_,
      "request error - ",
      STATUS_CODES[error.status] || error.status,
    );
  } else {
    console.error(prefix_, error);
  }
}

export const createLogger = (metaEx: MetaEx) => ({
  info(arg1: unknown, ...args: unknown[]) {
    info(labelFrom(metaEx), arg1, ...args);
  },
  warn(arg1: unknown, ...args: unknown[]) {
    warn(labelFrom(metaEx), arg1, ...args);
  },
  error(arg1: unknown, ...args: unknown[]) {
    error(labelFrom(metaEx), arg1, ...args);
  },
  requestError(error: Response | Error) {
    requestError(labelFrom(metaEx), error);
  },
});

export default { info, warn, error, requestError };
