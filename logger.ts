import * as log from "https://deno.land/std@0.83.0/log/mod.ts";

const logger = log.getLogger()

export function networkError(source: string, error: Response | Error) {
  if ('status' in error) {
    logger.error(`[${source}] server returned error ${error.status}`)
  } else {
    logger.error(`[${source}] network error`)
    logger.error(error)
  }
}

export default logger