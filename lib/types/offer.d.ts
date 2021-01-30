export interface Offer {
  /** provider name */
  provider: string;

  /** game title, `title title` */
  title: string;
  /** who published the game */
  publisher?: string;
  /** who is the developer */
  developer?: string;
  /** offer link */
  link: string;

  /** price, 0 if free forever */
  price: number;
  /** discount, undefined if free forever */
  discount?: OfferDiscount;
}

export interface OfferDiscount {
  startDate?: Date;
  endDate?: Date;
  discountPrice: number;
  discountPercentage: number;
}
