import * as log from "https://deno.land/std@0.83.0/log/mod.ts";
import { STATUS_CODES } from "./status.ts";

const logger = log.getLogger() as log.Logger & {
  requestError: typeof requestError;
};

function requestError(meta: ImportMeta, error: Response | Error) {
  const source = meta.url.substring(
    // filename
    meta.url.lastIndexOf("/") + 1,
    // remove .{js,ts}
    meta.url.length - 3,
  );

  if ("status" in error) {
    logger.error(
      `[${source}] ${STATUS_CODES[error.status] || "Unknown Error"}`,
    );
  } else {
    logger.error(`[${source}]`);
    logger.error(error);
  }
}

logger.requestError = requestError;

export default logger;
