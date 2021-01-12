export default interface EpicStoreOffers {
  data: Data;
  extensions: Extensions;
}

export interface Extensions {
  cacheControl: CacheControl;
}

export interface CacheControl {
  version: number;
  hints: Hint[];
}

export interface Hint {
  path: (number | string | string)[];
  maxAge: number;
  scope?: string;
}

export interface Data {
  Catalog: Catalog;
}

export interface Catalog {
  searchStore: SearchStore;
}

export interface SearchStore {
  elements: Element[];
  paging: Paging;
}

export interface Paging {
  count: number;
  total: number;
}

export interface Element {
  title: string;
  id: string;
  namespace: string;
  description: string;
  effectiveDate: string;
  keyImages: KeyImage[];
  currentPrice: number;
  seller: Seller;
  productSlug: string;
  urlSlug: string;
  url?: unknown;
  tags: Tag[];
  items: Item[];
  customAttributes: CustomAttribute[];
  categories: Category[];
  price: Price;
}

export interface Price {
  totalPrice: TotalPrice;
  lineOffers: LineOffer[];
}

export interface LineOffer {
  appliedRules: AppliedRule[];
}

export interface AppliedRule {
  id: string;
  endDate: string;
  discountSetting: DiscountSetting;
}

export interface DiscountSetting {
  discountType: string;
}

export interface TotalPrice {
  discountPrice: number;
  originalPrice: number;
  voucherDiscount: number;
  discount: number;
  currencyCode: string;
  currencyInfo: CurrencyInfo;
  fmtPrice: FmtPrice;
}

export interface FmtPrice {
  originalPrice: string;
  discountPrice: string;
  intermediatePrice: string;
}

export interface CurrencyInfo {
  decimals: number;
}

export interface Category {
  path: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface Item {
  id: string;
  namespace: string;
}

export interface Tag {
  id: string;
}

export interface Seller {
  id: string;
  name: string;
}

export interface KeyImage {
  type: string;
  url: string;
}
