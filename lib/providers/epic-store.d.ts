export interface EpicPage {
  data: {
    Catalog: {
      searchStore: {
        elements: EpicProduct[];
        paging: {
          count: number;
          total: number;
        };
      };
    };
  };
  /** delete */
  extensions: unknown;
}

export interface EpicProduct {
  /** title */
  title: string;
  /** publisher and developer */
  customAttributes: EpicKV[];
  /** publisher fallback */
  seller: {
    /** publisher fallback */
    name: string;
  };
  /** link: `https://www.epicgames.com/store/en-US/product/${productSlug}` */
  productSlug: string;
  /** price & offer */
  price: {
    totalPrice: {
      /** price = originalPrice / scale */
      originalPrice: number;
      /** offer.discountPrice = originalPrice / scale */
      discountPrice: number;
      /** offer.discountPercentage = Math.round(discount / originalPrice * 100) */
      discount: number;
      /** scale */
      currencyInfo: {
        /** scale = 10 ** decimals */
        decimals: number;
      };
    };
    /** endDate */
    lineOffers: EpicLineOffer[];
  };
  /** offer.startDate */
  effectiveDate: string;
}

export interface EpicLineOffer {
  /** endDate */
  appliedRules: EpicOffer[];
}

export interface EpicOffer {
  /** offer.endDate */
  endDate: string;
}

export interface EpicKV {
  key: "publisherName" | "developerName";
  value: string;
}
