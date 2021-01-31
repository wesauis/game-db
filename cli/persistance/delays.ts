import { existsSync } from "../deps.ts";
import { dateReviver, readJSON, writeJSON } from "./json.ts";
import { paths } from "./paths.ts";

export interface LastRuns {
  [id: string]: Date;
}

const filePath = `${paths.config}/delays.json`;

export function load(): LastRuns {
  if (existsSync(filePath)) {
    return readJSON<LastRuns>(filePath, dateReviver);
  }

  return {};
}

export function update(lastRuns: LastRuns, providers: string[]) {
  const now = new Date();

  providers.forEach((id) => {
    lastRuns[id] = now;
  });

  writeJSON(filePath, lastRuns, { create: true });
}
