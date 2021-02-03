import { OfferProvider } from "../offer-provider.ts";
import type { Offer, OfferDiscount } from "../types/Offer.d.ts";
import { parseResJson } from "../utils/parsers.ts";
import time from "../utils/time.ts";
import { EPIC_API_URL, EPIC_GRAPHQL_QUERY } from "./epic-store.const.ts";
import type { EpicPage, EpicProduct } from "./epic-store.d.ts";

export default class EpicStore extends OfferProvider {
  constructor(public readonly category: "free" | "discounted") {
    super(
      "epic-store",
      category,
      category === "free" ? time(5, "DAYS") : time(18, "HOURS"),
    );
  }

  async _query(): Promise<Offer[]> {
    const products = await this.fetchProducts();

    return products.map((product) => this.toOffer(product));
  }

  private async fetchProducts(): Promise<EpicProduct[]> {
    const productPages: EpicProduct[][] = [];

    try {
      let currentPage = 0, totalPages = 0;

      do {
        const page = await fetch(
          EPIC_API_URL,
          {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: this.buildBody(currentPage),
          },
        ).then(parseResJson) as EpicPage;

        delete page["extensions"];

        const { elements: products, paging } = page.data.Catalog.searchStore;
        productPages.push(products);

        totalPages = Math.ceil(paging.total / 250);
        currentPage += 1;
      } while (currentPage < totalPages);
    } catch (error) {
      console.error(error);
    }

    return productPages.flat();
  }

  private buildBody(page: number): string {
    return JSON.stringify(
      {
        query: EPIC_GRAPHQL_QUERY,
        variables: {
          allowCountries: "BR",
          country: "BR",
          locale: "pt-BR",

          start: Math.round(250 * page),
          count: 250,

          onSale: this.category === "discounted" ? true : null,
          freeGame: this.category === "free" ? true : null,
        },
      },
      undefined,
      1,
    );
  }

  private toOffer(product: EpicProduct): Offer {
    let publisher: Offer["publisher"];
    let developer: Offer["developer"];
    product.customAttributes.forEach(({ key, value }) => {
      switch (key) {
        case "publisherName":
          publisher = value;
          break;
        case "developerName":
          developer = value;
          break;
      }
    });
    publisher = publisher || product.seller.name;

    const [price, discount] = this.getDiscount(product);

    return {
      title: product.title,
      publisher,
      developer,
      link:
        `https://www.epicgames.com/store/en-US/product/${product.productSlug}`,
      price,
      discount,
    };
  }

  private getDiscount(
    product: EpicProduct,
  ): [number, OfferDiscount | undefined] {
    if (this.category === "free") return [0, undefined];

    const { decimals } = product.price.totalPrice.currencyInfo;
    const { originalPrice, discountPrice, discount } = product.price.totalPrice;

    const scale = 10 ** decimals;
    const price = originalPrice / scale;

    const { lineOffers } = product.price;
    const endDate = lineOffers?.[0]?.appliedRules?.[0]?.endDate;

    if (!endDate) {
      console.warn(`endDate is undefined:`, { product });
    }

    return [
      price,
      {
        startDate: new Date(product.effectiveDate),
        endDate: new Date(endDate),
        discountPrice: discountPrice / scale,
        discountPercentage: Math.round(discount / originalPrice * 100),
      },
    ];
  }
}
