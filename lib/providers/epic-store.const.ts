export const EPIC_API_URL = "https://www.epicgames.com/graphql";

export const EPIC_GRAPHQL_QUERY = `query searchStoreQuery(
  $category: String = "games/edition/base|bundles/games|editors|software/edition/base"
  
  $allowCountries: String
  $country: String!
  $locale: String
  
  $start: Int
  $count: Int

  $onSale: Boolean
  $freeGame: Boolean
) {
  Catalog {
    searchStore(
      category: $category
      
      allowCountries: $allowCountries
      country: $country
      locale: $locale
      
      count: $count
      start: $start

      onSale: $onSale
      freeGame: $freeGame
    ) {
      elements {
        title
        effectiveDate
        seller {
          name
        }
        productSlug
        customAttributes {
          key
          value
        }
        price(country: $country) {
          totalPrice {
            originalPrice
            discountPrice
            discount
            currencyInfo {
              decimals
            }
          }
          lineOffers {
            appliedRules {
              endDate
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
