import * as log from "https://deno.land/std@0.83.0/log/mod.ts";

const logger = log.getLogger();

export function logRequestError(meta: ImportMeta, error: Response | Error) {
  const source = meta.url.substring(
    // filename
    meta.url.lastIndexOf("/") + 1,
    // remove .{js,ts}
    meta.url.length - 3,
  );

  if ("status" in error) {
    logger.error(`[${source}] server returned error ${error.status}`);
  } else {
    logger.error(`[${source}] network error`);
    logger.error(error);
  }
}

export default logger;
