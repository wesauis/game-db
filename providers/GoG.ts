import logger from "../logging/logger.ts";
import type GoG from "../types/GoG.d.ts";
import type { Product } from "../types/GoG.d.ts";
import { GameOffer } from "../types/types.d.ts";
import { parseNum, parseResJson } from "../utils/parsers.ts";

function toOffer(product: Product): GameOffer {
  return {
    provider: "GoG",
    title: product.title,
    price: {
      original: parseNum(product.price.baseAmount, "."),
      actual: parseNum(product.price.finalAmount, "."),
      discount: product.price.discountPercentage,
      currencyCode: "BRL",
    },
    link: `https://www.gog.com${product.url}`,
  };
}

export default async function GoGFree(): Promise<GameOffer[]> {
  const params = new URLSearchParams({
    mediaType: "game",
    price: "discounted",
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
