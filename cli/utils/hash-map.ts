import { hashObject, ObjectHash } from "../deps.ts";

export type HashMap<T> = Record<ObjectHash, T>;

export function toHashMap<T>(array: T[]): HashMap<T> {
  const hashMap: HashMap<T> = {};

  for (const item of array) {
    const hash = hashObject(item);

    if (hashMap[hash]) {
      console.warn(`duplicated item: `, hash, hashMap[hash], item);
      continue;
    }

    hashMap[hash] = item;
  }

  return hashMap;
}
