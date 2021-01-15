import logger from "../logging/logger.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import { parseResJson } from "../utils/parsers.ts";
import { GameOfferProvider } from "./../types/GameOfferProvider.d.ts";

const GOG_API_URL =
  "https://www.gog.com/games/ajax/filtered?mediaType=game&sort=rating";

interface GoGResponse {
  products: Product[];
  totalPages: number;
}

interface Product {
  title: string;
  developer: string;
  publisher: string;
  price: {
    baseAmount: string;
    finalAmount: string;
    discountPercentage: number;
    isFree: boolean;
  };
  url: string;
}

export default class GoG implements GameOfferProvider {
  async fetchPages(pricing: "free" | "discounted"): Promise<GoGResponse[]> {
    const pages: GoGResponse[] = [];

    try {
      let current = 1, total = 0;

      do {
        const page = await fetch(`${GOG_API_URL}&price=${pricing}`)
          .then(parseResJson<GoGResponse>());

        total = page.totalPages;
        pages.push(page);

        logger.info(
          import.meta,
          `pricing: ${pricing}, page ${current} of ${total}, games: ${page.products.length}`,
        );
        current += 1;
      } while (current < total);
    } catch (error) {
      logger.requestError(import.meta, error);
    }

    return pages;
  }

  async query(): Promise<GameOffer[]> {
    logger.info(import.meta, "query started");

    const pages = await Promise.all([
      this.fetchPages("free"),
      this.fetchPages("discounted"),
    ]);

    const games = pages
      .flat()
      .map((page) => page.products)
      .flat();

    logger.info(import.meta, `${games.length} games found`);

    return games.map((game) => ({
      provider: "gog",
      title: game.title,
      publisher: game.publisher,
      developer: game.developer,
      price: game.price.isFree ? undefined : {
        base: Number(game.price.baseAmount),
        final: Number(game.price.finalAmount),
        discount: game.price.discountPercentage,
      },
      link: `https://www.gog.com${game.url}`,
    }));
  }
}
