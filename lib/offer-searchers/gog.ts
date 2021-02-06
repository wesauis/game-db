import type { Offer, OfferSearcher } from "../types/Offer.d.ts";
import { map } from "../utils/map.ts";
import { parseResJson } from "../utils/parsers.ts";
import type { GoGPage, GoGProduct } from "./gog.d.ts";

const GOG_API_URL = "https://www.gog.com/games/ajax/filtered";

type Categories = "free" | "discounted";

type MapToOffer = (
  product: GoGProduct,
  category: Categories,
) => Offer | undefined;

const toOffer: MapToOffer = (product, category) => {
  const { isDiscounted, isFree } = product.price;

  // discounted with free results: no, tanks
  if (category === "free" && isDiscounted) {
    console.warn("thats illegal:", product);
    return undefined;
  }

  // not discounted and not free, NOT A RESULT
  if (!isDiscounted && !isFree) {
    return undefined;
  }

  const { title, publisher, developer, url } = product;
  const { baseAmount, finalAmount, discountPercentage } = product.price;

  return {
    title,
    publisher,
    developer,
    link: `https://www.gog.com${url}`,
    price: isFree ? 0 : Number(baseAmount),
    discount: isFree ? undefined : {
      discountPrice: Number(finalAmount),
      discountPercentage,
    },
  };
};

async function gog(limit: number, category: Categories): Promise<Offer[]> {
  const products: GoGProduct[] = [];

  try {
    let currentPage = 1, totalPages = 0;

    const params = new URLSearchParams({
      mediaType: "game",
      price: category,
    });

    do {
      params.set("page", currentPage.toFixed(0));

      const page = await fetch(`${GOG_API_URL}?${params.toString()}`)
        .then(parseResJson) as GoGPage;

      totalPages = page.totalPages;
      products.push(...page.products);

      currentPage += 1;
    } while (currentPage <= totalPages && products.length < limit);
  } catch (error) {
    console.error(error);
  }

  return map(products, (product) => toOffer(product, category));
}

export const gogFree: OfferSearcher = (limit = Infinity) => {
  return gog(limit, "free");
};

export const gogDiscounted: OfferSearcher = (limit = Infinity) => {
  return gog(limit, "discounted");
};
