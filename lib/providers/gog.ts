import { OfferProvider } from "../offer-provider.ts";
import type { Offer, OfferDiscount } from "../types/Offer.d.ts";
import { parseResJson } from "../utils/parsers.ts";
import time from "../utils/time.ts";
import type { GoGPage, GoGProduct } from "./gog.d.ts";

const GOG_API_URL =
  "https://www.gog.com/games/ajax/filtered?mediaType=game&sort=rating";

export default class GoG extends OfferProvider {
  constructor(public readonly category: "free" | "discounted") {
    super(
      "gog",
      category,
      category === "free" ? time(5, "DAYS") : time(18, "HOURS"),
    );
  }

  async _query(): Promise<Offer[]> {
    const products = await this.fetchProducts();

    return products.map((product) => this.toOffer(product));
  }

  private async fetchProducts(): Promise<GoGProduct[]> {
    const productPages: GoGProduct[][] = [];
    try {
      let currentPage = 1, totalPages = 0;

      do {
        const page = await fetch(
          `${GOG_API_URL}&price=${this.category}&page=${currentPage}`,
        ).then(parseResJson) as GoGPage;

        totalPages = page.totalPages;
        productPages.push(page.products);

        currentPage += 1;
      } while (currentPage <= totalPages);
    } catch (error) {
      console.error(error);
    }

    return productPages.flat();
  }

  private toOffer(product: GoGProduct): Offer {
    const [price, discount] = this.getDiscount(product);

    return {
      provider: this.provider,
      title: product.title,
      publisher: product.publisher,
      developer: product.developer,
      link: `https://www.gog.com${product.url}`,
      price,
      discount,
    };
  }

  private getDiscount(
    product: GoGProduct,
  ): [number, OfferDiscount | undefined] {
    if (this.category === "free" && product.price.isDiscounted) {
      console.warn("thats illegal:", product);
    }

    const { isFree, baseAmount, finalAmount, discountPercentage } =
      product.price;
    if (isFree) return [0, undefined];

    return [
      Number(baseAmount),
      {
        discountPrice: Number(finalAmount),
        discountPercentage,
      },
    ];
  }
}
