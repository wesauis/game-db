import { cyan, red, yellow } from "../deps.ts";
import { STATUS_CODES } from "./status.ts";

let enabled = true;
export function disableLogger() {
  enabled = false;
}

function prefix(meta: ImportMeta) {
  return `[${
    meta.url.substring(
      // filename
      meta.url.lastIndexOf("/") + 1,
      // remove .{js,ts}
      meta.url.length - 3,
    )
  }]`;
}

function info(meta: ImportMeta, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.info(cyan(prefix(meta)), arg1, ...args);
}

function warn(meta: ImportMeta, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.warn(yellow(prefix(meta)), arg1, ...args);
}

function error(meta: ImportMeta, arg1: unknown, ...args: unknown[]) {
  if (enabled) console.error(red(prefix(meta)), arg1, ...args);
}

function requestError(meta: ImportMeta, error: Response | Error) {
  if (!enabled) return;

  const prefix_ = red(prefix(meta));

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

export default {
  info,
  warn,
  error,
  requestError,
};
