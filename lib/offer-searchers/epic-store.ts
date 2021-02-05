import type { Offer, OfferSearcher } from "../types/Offer.d.ts";
import { map } from "../utils/map.ts";
import { parseResJson } from "../utils/parsers.ts";
import {
  EPIC_API_URL,
  EPIC_GRAPHQL_QUERY,
  RESULTS_PER_PAGE,
} from "./epic-store.const.ts";
import type { Categories, EpicPage, EpicProduct } from "./epic-store.d.ts";

function buildBody(page: number, category: Categories): string {
  return JSON.stringify(
    {
      query: EPIC_GRAPHQL_QUERY,
      variables: {
        allowCountries: "BR",
        country: "BR",
        locale: "pt-BR",

        start: Math.round(RESULTS_PER_PAGE * page),
        count: RESULTS_PER_PAGE,

        onSale: category === "discounted" ? true : null,
        freeGame: category === "free" ? true : null,
      },
    },
    undefined,
    1,
  );
}

type MapToPricing = (
  product: EpicProduct,
  category: Categories,
) => [Offer["price"], Offer["discount"]];

const extractPricing: MapToPricing = (product, category) => {
  if (category === "free") return [0, undefined];

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
};

type MapToOffer = (
  product: EpicProduct,
  category: Categories,
) => Offer | undefined;

const toOffer: MapToOffer = (product, category) => {
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

  const [price, discount] = extractPricing(product, category);

  const { title, productSlug } = product;

  const link = `https://www.epicgames.com/store/en-US/product/${productSlug}`;

  return { title, publisher, developer, link, price, discount };
};

type EpicStoreSearcher = (
  limit: number,
  category: Categories,
) => Promise<Offer[]>;

const epicStore: EpicStoreSearcher = async (limit = Infinity, category) => {
  const products: EpicProduct[] = [];

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
          body: buildBody(currentPage, category),
        },
      ).then(parseResJson) as EpicPage;
      delete page["extensions"];

      const { elements: pageProducts, paging } = page.data.Catalog.searchStore;
      products.push(...pageProducts);

      totalPages = Math.ceil(paging.total / RESULTS_PER_PAGE);
      currentPage += 1;
    } while (currentPage < totalPages && products.length < limit);
  } catch (error) {
    console.error(error);
  }

  return map(products, (product) => toOffer(product, category));
};

export const epicStoreFree: OfferSearcher = async (limit) => {
  return await epicStore(limit, "free");
};

export const epicStoreDiscounted: OfferSearcher = async (limit) => {
  return await epicStore(limit, "discounted");
};
