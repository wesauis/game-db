import { OfferSearcher } from "../../lib/lib.ts";
import { readJSON, writeJSON } from "./json.ts";
import { paths } from "./paths.ts";

type LastRuns = Record<string, number>;
type Searchers = Record<string, OfferSearcher>;

const LAST_RUNS_JSON_PATH = `${paths.config}/delays.json`;
const DELAY = 43200000; // 12 hours

export function removeDelayed(searchers: Searchers): Searchers {
  const delays = readJSON<LastRuns>(LAST_RUNS_JSON_PATH) || {};

  const toRun: Searchers = {};

  const now = Date.now();
  Object.keys(searchers).forEach((id) => {
    const lastRun = delays[id];
    const canRun = !lastRun || lastRun + DELAY < now;

    if (canRun) {
      delays[id] = now;
      toRun[id] = searchers[id];
    } else {
      console.warn(`search delayed for: ${id} `);
    }
  });

  writeJSON(LAST_RUNS_JSON_PATH, delays, { create: true });

  return toRun;
}
