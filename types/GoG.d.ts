export default interface GoG {
  products: Product[];
  ts?: unknown;
  page: number;
  totalPages: number;
  totalResults: string;
  totalGamesFound: number;
  totalMoviesFound: number;
}

export interface Product {
  customAttributes: unknown[];
  developer: string;
  publisher: string;
  gallery: string[];
  video?: Video;
  supportedOperatingSystems: string[];
  genres: string[];
  globalReleaseDate: number;
  isTBA: boolean;
  price: Price;
  isDiscounted: boolean;
  isInDevelopment: boolean;
  id: number;
  releaseDate: number;
  availability: Availability;
  salesVisibility: SalesVisibility;
  buyable: boolean;
  title: string;
  image: string;
  url: string;
  supportUrl: string;
  forumUrl: string;
  worksOn: WorksOn;
  category: string;
  originalCategory: string;
  rating: number;
  type: number;
  isComingSoon: boolean;
  isPriceVisible: boolean;
  isMovie: boolean;
  isGame: boolean;
  slug: string;
  isWishlistable: boolean;
}

export interface WorksOn {
  Windows: boolean;
  Mac: boolean;
  Linux: boolean;
}

export interface SalesVisibility {
  isActive: boolean;
  fromObject: FromObject;
  from: number;
  toObject: FromObject;
  to: number;
}

export interface FromObject {
  date: string;
  timezone_type: number;
  timezone: string;
}

export interface Availability {
  isAvailable: boolean;
  isAvailableInAccount: boolean;
}

export interface Price {
  amount: string;
  baseAmount: string;
  finalAmount: string;
  isDiscounted: boolean;
  discountPercentage: number;
  discountDifference: string;
  symbol: string;
  isFree: boolean;
  discount: number;
  isBonusStoreCreditIncluded: boolean;
  bonusStoreCreditAmount: string;
  promoId?: unknown;
}

export interface Video {
  id: string;
  provider: string;
}
