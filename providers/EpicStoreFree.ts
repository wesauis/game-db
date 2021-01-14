import type { Element } from "../deps.ts";
import { DOMParser } from "../deps.ts";
import logger from "../logging/logger.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import { parseElements, parseResText } from "../utils/parsers.ts";

function toOffer(element: Element): GameOffer {
  const $title = element.querySelector(
    'span[data-testid="offer-title-info-title"]',
  );
  const $publisher = element.querySelector(
    'span[data-testid="offer-title-info-subtitle"]',
  );

  return {
    provider: "EpicStoreFree",
    title: $title!.textContent,
    publisher: $publisher!.textContent,
    link: `https://www.epicgames.com${element.attributes.href}`,
  };
}

export default async function EpicStoreFree(): Promise<GameOffer[]> {
  try {
    const html = await fetch(
      "https://www.epicgames.com/store/en-US/free-games",
    ).then(parseResText);

    const $freeGames = new DOMParser()
      .parseFromString(html, "text/html")!
      .querySelectorAll('a[aria-label^="Free to Play"]');

    return parseElements($freeGames).map(toOffer);
  } catch (error) {
    logger.requestError(import.meta, error);
  }

  return [];
}
