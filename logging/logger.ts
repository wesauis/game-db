import { getLogger, Logger } from "../deps.ts";
import { STATUS_CODES } from "./status.ts";

const logger = getLogger() as Logger & {
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
