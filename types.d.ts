import type * as providers from "./providers/_.ts";

export interface GameOffer {
  /** Registered Offer Provider */
  provider: keyof typeof providers;
  /** Game title */
  title: string;
  /** Offer pricing */
  price: GameOfferPrice;
  /** Offer link */
  link: string;
  /** If the offer is ended */
  ended: boolean;
}

export interface GameOfferPrice {
  /** Original Price */
  original: number;
  /** Price with discount */
  actual: number;
  /** Discount Percentage */
  discount: number;
  /** Currency code: 'USD', 'BRL' */
  currencyCode: string;
}

export type OfferProvider = () => Promise<GameOffer[]>;
