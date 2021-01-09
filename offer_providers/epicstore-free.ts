import type EpicStoreFreeJson from './epicstore-free.d.ts'
import { GameOffer, OfferProvider } from '../types.d.ts'

export const epicStoreFree: OfferProvider = async () => {
  const EPIC_STORE_FREE_GAMES_API = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=BR&allowCountries=BR'

  const json = await fetch(EPIC_STORE_FREE_GAMES_API)
    .then(respone => {
      if (respone.ok)
        return respone.json()
      else 
        throw respone
    })
    .catch(console.error) as EpicStoreFreeJson

  return json.data.Catalog.searchStore.elements
      // remove old offers
    .filter(el => el.effectiveDate !== '2099-01-01T00:00:00.000Z') 
    .map(el => {
      const originalPrice = el.price.totalPrice.originalPrice / 100
      const discountPrice = el.price.totalPrice.discountPrice / 100

      const startDateStr = el.effectiveDate
      const endDateStr = el.price.lineOffers[0]?.appliedRules[0]?.endDate

      const discountPerc = Math.abs((discountPrice - originalPrice) / originalPrice * 100);


      return {
        provider: 'epicStoreFree',
        title: el.title,
        price: {
          original: originalPrice,
          actual: discountPrice,
          discount: discountPerc,
          currencyCode: el.price.totalPrice.currencyCode,
        },
        from: startDateStr ? new Date(startDateStr) : new Date(),
        to: endDateStr ? new Date(endDateStr) : new Date(),
        link: `https://www.epicgames.com/store/en-US/product/${el.productSlug}/home`
      } as GameOffer
  })
}