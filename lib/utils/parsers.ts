import type { Element, HTMLDocument, NodeList } from "../deps.ts";
import { DOMParser } from "../deps.ts";

/** Parses the reponse body as json if `reponse.ok` throws the response or the error otherwise
 * 
 * ```ts
 * try {
 *   const json = await fetch('someapi.com')
 *     .then(parseResJson) as Type
 * } catch(error) {
 *   if (error instanceOf Error) {
 *     // network error
 *   } else {
 *     // request error
 *   } 
 * }
 * ```
 */
export function parseResJson(res: Response): Promise<unknown> {
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
}

/** Parses the reponse body as text if `reponse.ok` throws the response or the error otherwise
 * 
 * ```ts
 * try {
 *   const text = await fetch('example.com').then(parseResText)
 * } catch(error) {
 *   if (error instanceOf Error) {
 *     // network error
 *   } else {
 *     // request error
 *   } 
 * }
 * ```
 */
export function parseResText(res: Response): Promise<string> {
  if (res.ok) {
    return res.text();
  } else {
    throw res;
  }
}

/** Converts a string into a number
 * 
 * Ignores all non numbers and extra commas or dots
 * 
 * If NaN will throw a error
 * 
 * ```ts
 * parseNum('USD 3.000,6')// => 3000.6
 * ```
 */
export function parseNum(str?: string) {
  if (str) {
    let chars = str.replace(/[^\d.,-]/g, "").split("");

    const negative = chars[0] === "-";
    chars = chars.filter((char) => char !== "-");

    const normalized = [];
    let hasDot = false;
    for (const char of chars.reverse()) {
      const isDot = char === "." || char == ",";

      if (!isDot) normalized.unshift(char);

      if (isDot && !hasDot) {
        normalized.unshift(".");
        hasDot = true;
      }
    }

    if (negative) {
      normalized.unshift("-");
    }

    str = normalized.join("");
  }

  const parsed = Number(str);

  if (isNaN(parsed)) throw new Error(`number format exception: ${str}`);

  return parsed;
}

const domParser = new DOMParser();
/** Converts a string into a HTMLDocument */
export function parseHTML(text: string): HTMLDocument {
  const html = domParser.parseFromString(text, "text/html");

  if (html) return html;

  throw new Error("invalid html");
}

// TODO(wesauis): generator, iterable?
/** Converts a nodelist into a array */
export function parseElements(nodeList: NodeList): Element[] {
  return Array.from(nodeList as Iterable<Element>);
}
