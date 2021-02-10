import { OfferSearcher } from "../../lib/lib.ts";
import { readJSON, writeJSON } from "../utils/json.ts";
import { paths } from "../utils/paths.ts";

type LastRuns = Record<string, number>;

const LAST_RUNS_JSON_PATH = `${paths.config}/delays.json`;
const DELAY = 43200000; // 12 hours

export function filterDelayed(ids: string[]): string[] {
  const delays = readJSON<LastRuns>(LAST_RUNS_JSON_PATH) || {};

  const now = Date.now();

  const toRun = ids.filter((id) => {
    const lastRun = delays[id];
    const canRun = !lastRun || lastRun + DELAY < now;

    if (canRun) {
      delays[id] = now;
      return true;
    } else {
      return false;
    }
  });

  writeJSON(LAST_RUNS_JSON_PATH, delays, { create: true });

  return toRun;
}
