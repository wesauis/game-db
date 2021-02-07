import { existsSync } from "../deps.ts";

export function readJSON<T>(
  filePath: string,
): T | undefined {
  try {
    if (!existsSync(filePath)) {
      return undefined;
    } else {
      return JSON.parse(Deno.readTextFileSync(filePath)) as T;
    }
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

export function writeJSON<T>(
  filePath: string,
  object: T,
  options?: Deno.WriteFileOptions,
): void {
  try {
    const sJSON = JSON.stringify(object);

    Deno.writeTextFileSync(filePath, `${sJSON}\n`, options);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}
