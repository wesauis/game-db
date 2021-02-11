import { appPaths, existsSync } from "./deps.ts";

const paths = appPaths("game-db");

Object.values(paths).forEach((path) => {
  if (!existsSync(path)) {
    Deno.mkdirSync(path, { recursive: true });
  }
});

export { paths };
