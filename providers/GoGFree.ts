import logger from "../logging/logger.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import type GoG from "../types/GoG.d.ts";
import type { Product } from "../types/GoG.d.ts";
import { parseResJson } from "../utils/parsers.ts";

function toOffer(product: Product): GameOffer {
  return {
    provider: "GoGFree",
    title: product.title,
    publisher: product.publisher,
    link: `https://www.gog.com${product.url}`,
  };
}

export default async function GoGFree(): Promise<GameOffer[]> {
  const params = new URLSearchParams({
    mediaType: "game",
    price: "free",
    sort: "rating",
  });

  const offers: GoG[] = [];

  try {
    let page = 1;
    let offerPage: GoG;
    do {
      params.set("page", page.toFixed(0));

      offerPage = await fetch(
        `https://www.gog.com/games/ajax/filtered?${params}`,
      ).then(parseResJson<GoG>());

      offers.push(offerPage);
    } while (page++ < offerPage.totalPages);

    return offers.map((pg) => pg.products.map(toOffer)).flat();
  } catch (error) {
    logger.requestError(import.meta, error);
  }

  return [];
}
