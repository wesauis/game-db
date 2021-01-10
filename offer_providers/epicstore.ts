import { GameOffer, OfferProvider } from '../types.d.ts'
import EpicStorePromos from './epicstore.d.ts'
import { getJSON } from '../utils.ts'
import { networkError } from '../logger.ts'

function fetchPromotions(): Promise<EpicStorePromos> {
  return fetch("https://www.epicgames.com/graphql", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://www.epicgames.com/store/pt-BR/browse?sortBy=releaseDate&sortDir=DESC&pageSize=30",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"query\":\"query searchStoreQuery($allowCountries: String, $category: String, $count: Int, $country: String!, $keywords: String, $locale: String, $namespace: String, $itemNs: String, $sortBy: String, $sortDir: String, $start: Int, $tag: String, $releaseDate: String, $withPrice: Boolean = false, $withPromotions: Boolean = false, $priceRange: String, $freeGame: Boolean, $onSale: Boolean, $effectiveDate: String) {\\n  Catalog {\\n    searchStore(\\n      allowCountries: $allowCountries\\n      category: $category\\n      count: $count\\n      country: $country\\n      keywords: $keywords\\n      locale: $locale\\n      namespace: $namespace\\n      itemNs: $itemNs\\n      sortBy: $sortBy\\n      sortDir: $sortDir\\n      releaseDate: $releaseDate\\n      start: $start\\n      tag: $tag\\n      priceRange: $priceRange\\n      freeGame: $freeGame\\n      onSale: $onSale\\n      effectiveDate: $effectiveDate\\n    ) {\\n      elements {\\n        title\\n        id\\n        namespace\\n        description\\n        effectiveDate\\n        keyImages {\\n          type\\n          url\\n        }\\n        currentPrice\\n        seller {\\n          id\\n          name\\n        }\\n        productSlug\\n        urlSlug\\n        url\\n        tags {\\n          id\\n        }\\n        items {\\n          id\\n          namespace\\n        }\\n        customAttributes {\\n          key\\n          value\\n        }\\n        categories {\\n          path\\n        }\\n        price(country: $country) @include(if: $withPrice) {\\n          totalPrice {\\n            discountPrice\\n            originalPrice\\n            voucherDiscount\\n            discount\\n            currencyCode\\n            currencyInfo {\\n              decimals\\n            }\\n            fmtPrice(locale: $locale) {\\n              originalPrice\\n              discountPrice\\n              intermediatePrice\\n            }\\n          }\\n          lineOffers {\\n            appliedRules {\\n              id\\n              endDate\\n              discountSetting {\\n                discountType\\n              }\\n            }\\n          }\\n        }\\n        promotions(category: $category) @include(if: $withPromotions) {\\n          promotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n          upcomingPromotionalOffers {\\n            promotionalOffers {\\n              startDate\\n              endDate\\n              discountSetting {\\n                discountType\\n                discountPercentage\\n              }\\n            }\\n          }\\n        }\\n      }\\n      paging {\\n        count\\n        total\\n      }\\n    }\\n  }\\n}\\n\",\"variables\":{\"category\":\"games/edition/base|bundles/games|editors|software/edition/base\",\"count\":30,\"country\":\"BR\",\"keywords\":\"\",\"locale\":\"pt-BR\",\"sortBy\":\"releaseDate\",\"sortDir\":\"DESC\",\"allowCountries\":\"BR\",\"start\":0,\"tag\":\"\",\"releaseDate\":\"[,2021-01-10T00:34:29.117Z]\",\"onSale\":true,\"effectiveDate\":\"[,2021-01-10T00:34:29.118Z]\",\"withPrice\":true}}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
  .then(res => getJSON<EpicStorePromos>(res))
}

export const EpicStore: OfferProvider = async () => {
  try {
    const promos = await fetchPromotions()

    return promos.data.Catalog.searchStore.elements
      .map(el => {
        const { title, productSlug, effectiveDate } = el
        const { totalPrice: { originalPrice, discountPrice, currencyCode }, lineOffers } = el.price

        const original = originalPrice / 100
        const actual = discountPrice / 100
        const discount = Math.abs((actual - original) / original * 100);

        const endDateStr = lineOffers[0]?.appliedRules[0]?.endDate

        return {
          provider: 'EpicStore',
          title,
          price: {
            original,
            actual,
            discount,
            currencyCode: currencyCode,
          },
          from: effectiveDate ? new Date(effectiveDate) : new Date(),
          to: endDateStr ? new Date(endDateStr) : new Date(),
          link: `https://www.epicgames.com/store/en-US/product/${productSlug}`
        } as GameOffer
    })
  } catch(error) {
    networkError('EpicStorePromotions', error)
    return []
  }
}
