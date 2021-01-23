import type { Element, HTMLDocument, NodeList } from "../deps.ts";
import { DOMParser } from "../deps.ts";

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

export function parseNum(price: string | null, comma = ",") {
  // remove non numbers or commas
  let normalized = price?.replaceAll(new RegExp(`[^0-9${comma[0]}]+`, "g"), "");

  // replace last comma with a dot
  const index = normalized?.lastIndexOf(",");
  if (index != null && index !== -1) {
    const l = normalized!.substring(0, index);
    const r = normalized!.substring(index + 1);
    normalized = `${l}.${r}`;
  }

  // remove extra commas
  normalized = normalized?.replaceAll(/,/g, "");

  const parsed = Number(normalized);

  if (isNaN(parsed)) throw new Error(`number format exception: ${normalized}`);

  return parsed;
}

const domParser = new DOMParser();
export function parseHTML(html: string): HTMLDocument | null {
  return domParser.parseFromString(html, "text/html");
}

export function parseElements(nodeList: NodeList): Element[] {
  return Array.from(nodeList as Iterable<Element>);
}
