export default interface EpicStorePromos {
  data: Data;
  extensions: Extensions;
}

interface Extensions {
  cacheControl: CacheControl;
}

interface CacheControl {
  version: number;
  hints: Hint[];
}

interface Hint {
  path: (number | string | string)[];
  maxAge: number;
  scope?: string;
}

interface Data {
  Catalog: Catalog;
}

interface Catalog {
  searchStore: SearchStore;
}

interface SearchStore {
  elements: Element[];
  paging: Paging;
}

interface Paging {
  count: number;
  total: number;
}

interface Element {
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

interface Price {
  totalPrice: TotalPrice;
  lineOffers: LineOffer[];
}

interface LineOffer {
  appliedRules: AppliedRule[];
}

interface AppliedRule {
  id: string;
  endDate: string;
  discountSetting: DiscountSetting;
}

interface DiscountSetting {
  discountType: string;
}

interface TotalPrice {
  discountPrice: number;
  originalPrice: number;
  voucherDiscount: number;
  discount: number;
  currencyCode: string;
  currencyInfo: CurrencyInfo;
  fmtPrice: FmtPrice;
}

interface FmtPrice {
  originalPrice: string;
  discountPrice: string;
  intermediatePrice: string;
}

interface CurrencyInfo {
  decimals: number;
}

interface Category {
  path: string;
}

interface CustomAttribute {
  key: string;
  value: string;
}

interface Item {
  id: string;
  namespace: string;
}

interface Tag {
  id: string;
}

interface Seller {
  id: string;
  name: string;
}

interface KeyImage {
  type: string;
  url: string;
}
