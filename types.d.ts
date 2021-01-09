import type * as providers from './offer_providers/all.ts'

export interface GameOffer {
  /** Registered Offer Provider */
  provider: keyof typeof providers      
  /** Game title */
  title: string                       
  price: {            
    /** Original Price */
    original: number,                 
    /** Price with discount */
    actual: number,                   
    /** Discount Percentage */
    discount: number                  
    /** Currency code: 'USD', 'BRL' */
    currencyCode: string              
  }
  /** Offer link */
  link: string                        
  /** when the promo started / when was found */
  from?: Date                         
  /** when the promo ended / when was not found */
  to?: Date                           
}

export type OfferProvider = () => Promise<GameOffer[]>