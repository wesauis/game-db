import type { Element, NodeList } from "../deps.ts";
import { textOf } from "./utils.ts";

export function parseResJson<T>() {
  return (res: Response): Promise<T> => {
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw res;
    }
  };
}

export function parseResText(res: Response): Promise<string> {
  if (res.ok) {
    return res.text();
  } else {
    throw res;
  }
}

export function parseNum(price: Element | string | null) {
  const raw = !price || typeof price === "string" ? price : textOf(price);

  // remove non numbers or commas
  let normalized = raw?.replaceAll(/[^0-9,]+/g, "");

  // replace last comma with a dot
  const index = normalized?.lastIndexOf(",");
  if (index && index !== -1 && normalized) {
    const l = normalized.substring(0, index);
    const r = normalized.substring(index + 1);
    normalized = `${l}.${r}`;
  }

  // remove extra commas
  normalized = normalized?.replaceAll(/,/g, "");

  const parsed = Number(normalized);

  if (isNaN(parsed)) throw new Error(`number format exception: ${normalized}`);

  return parsed;
}

export function parseElements<T>(
  nodeList: NodeList,
  map: (value: Element, index: number, array: Element[]) => T,
): T[] {
  return Array.from(nodeList as Iterable<Element>).map(map);
}
