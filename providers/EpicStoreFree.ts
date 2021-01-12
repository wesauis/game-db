import type { Element } from "../deps.ts";
import { DOMParser } from "../deps.ts";
import logger from "../logging/logger.ts";
import type { GameOffer, OfferProvider } from "../types/types.d.ts";
import { parseElements, parseResText } from "../utils/parsers.ts";

function toOffer(el: Element): GameOffer {
  const $title = el.querySelector(
    'div[class$="OfferCard__meta"] span[data-testid="offer-title-info-title"]',
  ) as Element;

  return {
    provider: "EpicStoreFree",
    title: $title.textContent,
    price: {
      original: 0,
      actual: 0,
      discount: 100,
      currencyCode: "*",
    },
    link: `https://www.epicgames.com${el.attributes["href"]}`,
  };
}

const EpicStoreFree: OfferProvider = async () => {
  try {
    const html = await fetch(
      "https://www.epicgames.com/store/en-US/free-games",
    ).then(parseResText);

    const $freeGames = new DOMParser()
      .parseFromString(html, "text/html")
      ?.querySelectorAll('a[aria-label^="Free to Play"]');
    if (!$freeGames) {
      throw new Error("no results");
    }

    return parseElements($freeGames).map(toOffer);
  } catch (error) {
    logger.requestError(import.meta, error);
  }

  return [];
};

export default EpicStoreFree;
