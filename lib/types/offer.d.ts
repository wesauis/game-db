export type Offer = {
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
  discount?: {
    startDate?: Date;
    endDate?: Date;
    discountPrice: number;
    discountPercentage: number;
  };
};

export type OfferDiscount = NonNullable<Offer["discount"]>;
