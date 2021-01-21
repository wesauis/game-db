interface AnyMap {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

async function importDir(
  path: string,
  depth = 0,
): Promise<Promise<AnyMap>[]> {
  const imports: Promise<AnyMap>[] = [];

  // get all files on directory
  for await (const file of Deno.readDir(Deno.realPathSync(path))) {
    if (!file.name) continue;

    const currentPath = `${path}/${file.name}`;
    if (file.isFile && /\.(js|ts)$/.test(file.name)) {
      // import source file
      imports.push(import(currentPath));
    } else if (depth > 0 && file.isDirectory) {
      // import dir (recurse)
      imports.push(...await importDir(currentPath, depth - 1));
    }
  }

  return imports;
}

/**
 * Import all js or ts files on a directory.
 * 
 * @param path path to the directory
 * @param depth if subdirs are found, how deep the importer can search for files
 */

export default async (path: string, depth = 0): Promise<AnyMap[]> => {
  // unwarp the import array
  return Promise.all(await importDir(path, depth));
};
