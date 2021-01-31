export function readJSON<T>(
  filePath: string,
  // deno-lint-ignore no-explicit-any
  reviver?: (this: any, key: string, value: any) => any,
): T {
  try {
    const sJSON = Deno.readTextFileSync(filePath);
    return JSON.parse(sJSON, reviver) as T;
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

export function writeJSON(
  filePath: string,
  // deno-lint-ignore no-explicit-any
  object: any,
  options?: Deno.WriteFileOptions | undefined,
): void {
  try {
    const sJSON = JSON.stringify(object);

    Deno.writeTextFileSync(filePath, `${sJSON}\n`, options);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

const dateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
// deno-lint-ignore no-explicit-any
export function dateReviver(key: string, value: any) {
  if (typeof value === "string" && dateRegex.test(value)) {
    return new Date(value);
  }
  return value;
}
