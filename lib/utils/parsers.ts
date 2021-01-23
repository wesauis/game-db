import type { Element, HTMLDocument, NodeList } from "../deps.ts";
import { DOMParser } from "../deps.ts";

/**
 * @returns if `response.ok`, the parsed json
 * @throws if `!response.ok`, the response
 * @example
 *   try {
 *     const json = fetch('someapi.com')
 *       .then(parseResJson) as Type
 *   } catch(error) {
 *     if (error instanceOf Error) {
 *       // network error
 *     } else {
 *       // request error
 *     } 
 *   }
 */
export function parseResJson(res: Response): Promise<unknown> {
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
}

/**
 * @returns if `response.ok`, the response text
 * @throws if `!response.ok`, the response
 * @example
 *   try {
 *     const text = fetch('example.com')
 *       .then(parseResText) as Type
 *   } catch(error) {
 *     if (error instanceOf Error) {
 *       // network error
 *     } else {
 *       // request error
 *     } 
 *   }
 */
export function parseResText(res: Response): Promise<string> {
  if (res.ok) {
    return res.text();
  } else {
    throw res;
  }
}

/**
 * converts a string into a number
 * ignores all non numbers and comma
 * 
 * @param str 
 * @returns number
 * @throws if result is NaN
 * 
 * @example
 *   parseNum('USD 3.000,6') => 3000.6
 */
export function parseNum(str: string | null) {
  // remove non numbers and commas
  let normalized = str?.replaceAll(/[^0-9,]+/g, "");

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
/**
 * converts a string into a HTMLDocument
 * 
 * @param html 
 */
export function parseHTML(text: string): HTMLDocument {
  const html = domParser.parseFromString(text, "text/html");

  if (html) return html;

  throw new Error("invalid html");
}

/**
 * converts a nodelist into a array
 * 
 * @param nodeList 
 */
export function parseElements(nodeList: NodeList): Element[] {
  return Array.from(nodeList as Iterable<Element>);
}
