import logger from "../logging/logger.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import { parseResJson } from "../utils/parsers.ts";
import { GameOfferProvider } from "./../types/GameOfferProvider.d.ts";

const GOG_API_URL =
  "https://www.gog.com/games/ajax/filtered?mediaType=game&sort=rating";

interface GoGPage {
  products: GoGGame[];
  totalPages: number;
}

interface GoGGame {
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
  constructor(private readonly PRICING: "free" | "discounted") {}

  private static parseGame(game: GoGGame): GameOffer {
    return {
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
    };
  }

  async fetchGames() {
    const games: GoGGame[][] = [];

    try {
      let current = 1, total = 0;

      do {
        const page = await fetch(
          `${GOG_API_URL}&price=${this.PRICING}&page=${current}`,
        ).then(parseResJson<GoGPage>());

        total = page.totalPages;
        games.push(page.products);

        logger.info(
          import.meta,
          `pricing: ${this.PRICING}, page ${current} of ${total}, games: ${page.products.length}`,
        );
        current += 1;
      } while (current < total);
    } catch (error) {
      logger.requestError(import.meta, error);
    }

    return games;
  }

  async query(): Promise<GameOffer[]> {
    logger.info(import.meta, "query started");

    const games = await this.fetchGames()
      .then((pages) => pages.flat());

    logger.info(import.meta, `${games.length} games found`);

    return games.map(GoG.parseGame);
  }
}
