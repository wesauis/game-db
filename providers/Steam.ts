import type { Element } from "../deps.ts";
import { DOMParser } from "../deps.ts";
import logger from "../logging/logger.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import { parseElements, parseNum, parseResText } from "../utils/parsers.ts";

function toOffer(el: Element): GameOffer {
  const $title = el.querySelector(".title");
  const $discount = el.querySelector(".search_discount span");

  const [, base_, final_] = el
    .querySelector(".search_price")!
    .textContent.split("R$");

  return {
    provider: "Steam",
    title: $title!.textContent,
    price: {
      base: parseNum(base_),
      final: parseNum(final_),
      discount: parseNum($discount!.textContent),
    },
    link: el.attributes["href"],
  };
}

export default async function Steam(): Promise<GameOffer[]> {
  try {
    const html = await fetch(
      "https://store.steampowered.com/search/?sort_by=Reviews_DESC&category1=998&specials=1",
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
