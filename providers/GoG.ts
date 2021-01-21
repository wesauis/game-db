import { Logger } from "../logging/logger.ts";
import type { GameOfferProvider } from "../provider-registry.ts";
import { register } from "../provider-registry.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import { parseResJson } from "../utils/parsers.ts";

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

class GoG implements GameOfferProvider {
  name = "gog";
  logger = new Logger(`${this.name}/${this.category}`);

  constructor(readonly category: "free" | "discounted") {}

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

  private async fetchGames(): Promise<GoGGame[]> {
    const games: GoGGame[][] = [];

    try {
      let current = 1, total = 0;

      do {
        const page = await fetch(
          `${GOG_API_URL}&price=${this.category}&page=${current}`,
        ).then(parseResJson<GoGPage>());

        total = page.totalPages;
        games.push(page.products);

        this.logger.info(
          `found ${page.products.length} games at page ${current} of ${total}`,
        );

        current += 1;
      } while (current <= total);
    } catch (error) {
      this.logger.requestError(error);
    }

    return games.flat();
  }

  async query(): Promise<GameOffer[]> {
    this.logger.info("query started");

    const games = await this.fetchGames();

    this.logger.info(`query ended: ${games.length} games found`);

    return games.map(GoG.parseGame);
  }
}

register(new GoG("free"));
register(new GoG("discounted"));
