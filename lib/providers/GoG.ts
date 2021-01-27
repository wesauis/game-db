import { OfferProvider } from "../offer-provider.ts";
import type Offer from "../types/Offer.d.ts";
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

export default class GoG extends OfferProvider {
  public readonly name = "gog";
  constructor(public readonly category: "free" | "discounted") {
    super();
  }

  private static parseGame(game: GoGGame): Offer {
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
        ).then(parseResJson) as GoGPage;

        total = page.totalPages;
        games.push(page.products);

        current += 1;
      } while (current <= total);
    } catch (error) {
      console.error(error);
    }

    return games.flat();
  }

  async query(): Promise<Offer[]> {
    const games = await this.fetchGames();

    return games.map(GoG.parseGame);
  }
}
