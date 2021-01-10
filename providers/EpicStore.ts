import { GameOffer, OfferProvider } from "../types.d.ts";
import EpicStoreOffers, { Element } from "./EpicStoreOffers.d.ts";
import { parseJSON } from "../utils.ts";
import { logRequestError } from "../logger.ts";

function toOffer(offer: Element): GameOffer {
  const { title, productSlug } = offer;
  const { originalPrice, discountPrice, currencyCode } = offer.price.totalPrice;

  const original = originalPrice / 100;
  const actual = discountPrice / 100;
  const discount = (original - actual) / original * 100;

  return {
    provider: "EpicStore",
    title,
    price: { original, actual, discount, currencyCode },
    link: `https://www.epicgames.com/store/en-US/product/${productSlug}`,
    ended: false,
  };
}

export const EpicStore: OfferProvider = async () => {
  try {
    const offers = await fetch("https://www.epicgames.com/graphql", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      "referrer":
        "https://www.epicgames.com/store/pt-BR/browse?sortBy=releaseDate&sortDir=DESC&pageSize=30",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body":
        '{"query":"query searchStoreQuery($allowCountries: String, $category: String, $count: Int, $country: String!, $keywords: String, $locale: String, $namespace: String, $itemNs: String, $sortBy: String, $sortDir: String, $start: Int, $tag: String, $releaseDate: String, $withPrice: Boolean = false, $withPromotions: Boolean = false, $priceRange: String, $freeGame: Boolean, $onSale: Boolean, $effectiveDate: String) {\\n  Catalog {\\n    searchStore(\\n      allowCountries: $allowCountries\\n      category: $category\\n      count: $count\\n      country: $country\\n      keywords: $keywords\\n      locale: $locale\\n      namespace: $namespace\\n      itemNs: $itemNs\\n      sortBy: $sortBy\\n      sortDir: $sortDir\\n      releaseDate: $releaseDate\\n      start: $start\\n      tag: $tag\\n      priceRange: $priceRange\\n      freeGame: $freeGame\\n      onSale: $onSale\\n      effectiveDate: $effectiveDate\\n    ) {\\n      elements {\\n        title\\n        id\\n        namespace\\n        description\\n        effectiveDate\\n        keyImages {\\n          type\\n          url\\n        }\\n        currentPrice\\n        seller {\\n          id\\n          name\\n        }\\n        productSlug\\n        urlSlug\\n        url\\n        tags {\\n          id\\n        }\\n        items {\\n          id\\n          namespace\\n        }\\n        customAttributes {\\n          key\\n          value\\n        }\\n        categories {\\n          path\\n        }\\n        price(country: $country) @include(if: $withPrice) {\\n          totalPrice {\\n            discountPrice\\n            originalPrice\\n            voucherDiscount\\n            discount\\n            currencyCode\\n            currencyInfo {\\n              decimals\\n            }\\n            fmtPrice(locale: $locale) {\\n              originalPrice\\n              discountPrice\\n              intermediatePrice\\n            }\\n          }\\n          lineOffers {\\n            appliedRules {\\n              id\\n              endDate\\n              discountSetting {\\n                discountType\\n              }\\n            }\\n          }\\n        }\\n        promotions(category: $category) @include(if: $withPromotions) {\\n          promotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n          upcomingPromotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n        }\\n      }\\n      paging {\\n        count\\n        total\\n      }\\n    }\\n  }\\n}\\n","variables":{"category":"games/edition/base|bundles/games|editors|software/edition/base","count":30,"country":"BR","keywords":"","locale":"pt-BR","sortBy":"releaseDate","sortDir":"DESC","allowCountries":"BR","start":0,"tag":"","releaseDate":"[,2021-01-10T00:34:29.117Z]","onSale":true,"effectiveDate":"[,2021-01-10T00:34:29.118Z]","withPrice":true}}',
      "method": "POST",
      "mode": "cors",
      "credentials": "include",
    })
      .then(parseJSON<EpicStoreOffers>());

    return offers.data.Catalog.searchStore.elements.map(toOffer);
  } catch (error) {
    logRequestError("EpicStore", error);
    return [];
  }
};