import { createLogger } from "../logging/logger.ts";
import GameOffer from "../types/GameOffer.d.ts";
import { GameOfferProvider } from "../types/GameOfferProvider.d.ts";
import { parseResJson } from "../utils/parsers.ts";

const EPIC_API_URL = "https://www.epicgames.com/graphql";

const EPIC_GRAPHQL_QUERY = `query searchStoreQuery(
  $category: String = "games/edition/base|bundles/games|editors|software/edition/base"
  $onSale: Boolean = true

  $allowCountries: String
  $country: String!
  $locale: String

  $start: Int
  $count: Int
) {
  Catalog {
    searchStore(
      category: $category
      onSale: $onSale

      allowCountries: $allowCountries
      country: $country
      locale: $locale

      count: $count
      start: $start
    ) {
      elements {
        title
        seller {
          name
        }
        productSlug
        price(country: $country) {
          totalPrice {
            discountPrice
            originalPrice
            currencyInfo {
              decimals
            }
          }
        }
        promotions(category: $category) @include(if: false) {
          promotionalOffers {
            promotionalOffers {
              startDate
              endDate
              discountSetting {
                discountType
                discountPercentage
              }
            }
          }
          upcomingPromotionalOffers {
            promotionalOffers {
              startDate
              endDate
              discountSetting {
                discountType
                discountPercentage
              }
            }
          }
        }
      }
      paging {
        count
        total
      }
    }
  }
}`;

interface EpicPage {
  data: {
    Catalog: {
      searchStore: {
        elements: EpicGame[];
        paging: {
          count: number;
          total: number;
        };
      };
    };
  };
}

interface EpicGame {
  title: string;
  seller: {
    name: string;
  };
  productSlug: string;
  price: {
    totalPrice: {
      discountPrice: number;
      originalPrice: number;
      currencyInfo: {
        decimals: number;
      };
    };
  };
}

export default class EpicStore implements GameOfferProvider {
  logger = createLogger({ ...import.meta, suffix: undefined });

  private static buildBody(page: number): string {
    return JSON.stringify(
      {
        query: EPIC_GRAPHQL_QUERY,
        variables: {
          allowCountries: "BR",
          country: "BR",
          locale: "pt-BR",

          start: Math.round(250 * page),
          count: 250,
        },
      },
      undefined,
      1,
    );
  }

  private static parseGame(game: EpicGame): GameOffer {
    const {
      originalPrice,
      discountPrice,
      currencyInfo: { decimals },
    } = game.price.totalPrice;

    const scale = 10 ** decimals;
    const base = originalPrice / scale;
    const final = discountPrice / scale;
    const discount = (base - final) / base * 100;

    return {
      provider: "epic-store",
      title: game.title,
      publisher: game.seller.name,
      price: { base, final, discount },
      link: `https://www.epicgames.com/store/en-US/product/${game.productSlug}`,
    };
  }

  async fetchPages(): Promise<EpicGame[]> {
    const pages: EpicGame[][] = [];

    try {
      let current = 0, total = 0;

      do {
        const data = await fetch(
          EPIC_API_URL,
          {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: EpicStore.buildBody(current),
          },
        ).then(parseResJson<EpicPage>());

        const { elements: games, paging } = data.data.Catalog.searchStore;
        pages.push(games);

        total = Math.ceil(paging.total / 250);
        current += 1;
        this.logger.info(
          `found ${games.length} games at page ${current} of ${total}`,
        );
      } while (current < total);
    } catch (error) {
      this.logger.requestError(error);
    }

    return pages.flat();
  }

  async query(): Promise<GameOffer[]> {
    this.logger.info("query started");

    const games = await this.fetchPages();

    this.logger.info(`query ended: ${games.length} games found`);

    return games.map(EpicStore.parseGame);
  }
}

// function toOffer(offer: Element): GameOffer {
//   const { originalPrice, discountPrice, currencyInfo: { decimals } } =
//     offer.price.totalPrice;

//   const dec = 10 ** decimals;
//   const base = originalPrice / dec;
//   const final = discountPrice / dec;
//   const discount = (base - final) / base * 100;

//   return {
//     provider: "EpicStore",
//     publisher: offer.seller.name,
//     title: offer.title,
//     price: { base, final, discount },
//     link: `https://www.epicgames.com/store/en-US/product/${offer.productSlug}`,
//   };
// }
