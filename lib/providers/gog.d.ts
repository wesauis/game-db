export interface GoGPage {
  products: GoGProduct[];
  totalPages: number;
}

export interface GoGProduct {
  /** title */
  title: string;
  /** publisher */
  publisher: string;
  /** developer */
  developer: string;
  price: GoGPrice;
  /** link = `https://www.gog.com${url}` */
  url: string;
  buyable: boolean;
}

export interface GoGPrice {
  isFree: boolean;
  isDiscounted: boolean;
  /** price = Number(baseAmount) */
  baseAmount: string;
  /** discount.discountPrice = Number(finalAmount) */
  finalAmount: string;
  /** discount.discountPercentage */
  discountPercentage: number;
}
