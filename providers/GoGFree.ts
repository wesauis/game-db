// https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&price=free&sort=rating
// get all pages
import logger from "../logging/logger.ts";
import type GoG from "../types/GoG.d.ts";
import type { Product } from "../types/GoG.d.ts";
import { GameOffer } from "../types/types.d.ts";
import { parseResJson } from "../utils/parsers.ts";

function toOffer(product: Product): GameOffer {
  return {
    provider: "GoGFree",
    title: product.title,
    price: {
      original: 0,
      actual: 0,
      discount: 100,
      currencyCode: "*",
    },
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
