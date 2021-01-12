import type { Element } from "../deps.ts";
import { DOMParser } from "../deps.ts";
import logger from "../logging/logger.ts";
import type { GameOffer } from "../types/types.d.ts";
import { parseElements, parseNum, parseResText } from "../utils/parsers.ts";

function toOffer(el: Element): GameOffer {
  const $title = el.querySelector(".title");
  const $actual = el.querySelector(".search_price");
  const $original = el.querySelector("strike");
  const $discount = el.querySelector(".search_discount span");

  return {
    provider: "Steam",
    title: $title!.textContent,
    price: {
      original: parseNum($original),
      actual: parseNum($actual),
      discount: parseNum($discount),
      currencyCode: "BRL",
    },
    link: el.attributes["href"],
  };
}

export default async function Steam(): Promise<GameOffer[]> {
  try {
    const html = await fetch(
      "https://store.steampowered.com/search/?sort_by=Reviews_DESC&specials=1",
    ).then(parseResText);

    const $promotions = new DOMParser()
      .parseFromString(html, "text/html")!
      .querySelectorAll(".search_result_row");

    return parseElements($promotions).map(toOffer);
  } catch (error) {
    logger.requestError(import.meta, error);
  }

  return [];
}
