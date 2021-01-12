import type { Element } from "../deps.ts";

export function textOf(el: Element): string {
  return Array
    .from(el.childNodes)
    .filter((node) => node.nodeName === "#text")
    .map((node) => node.nodeValue)
    .join();
}
