import type { Element } from "../deps.ts";
import { DOMParser } from "../deps.ts";
import logger from "../logging/logger.ts";
import type { GameOffer, OfferProvider } from "../types/types.d.ts";
import { parseElements, parseNum, parseResText } from "../utils/parsers.ts";

function toOffer(el: Element): GameOffer {
  const $title = el.querySelector(".title") as Element;
  const $actual = el.querySelector(".search_price") as Element;
  const $original = el.querySelector("strike") as Element;
  const $discount = el.querySelector(".search_discount span") as Element;

  return {
    provider: "Steam",
    title: $title.textContent,
    price: {
      original: parseNum($original),
      actual: parseNum($actual),
      discount: parseNum($discount),
      currencyCode: "BRL",
    },
    link: el.attributes["href"],
  };
}

const Steam: OfferProvider = async () => {
  try {
    const html = await fetch(
      "https://store.steampowered.com/search/?sort_by=Reviews_DESC&specials=1",
    ).then(parseResText);

    const $promotions = new DOMParser()
      .parseFromString(html, "text/html")
      ?.querySelectorAll(".search_result_row");
    if (!$promotions) {
      throw new Error("no results");
    }

    return parseElements($promotions).map(toOffer);
  } catch (error) {
    logger.requestError(import.meta, error);
  }

  return [];
};

export default Steam;
