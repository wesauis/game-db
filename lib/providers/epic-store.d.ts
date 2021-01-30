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
  /** publisher & developer */
  customAttributes: EpicKV[];
  seller: {
    /** publisher fallback */
    name: string;
  };
  /** link = `https://www.epicgames.com/store/en-US/product/${productSlug}` */
  productSlug: string;
  price: {
    totalPrice: {
      /** price = originalPrice / scale */
      originalPrice: number;
      /** discount.discountPrice = discountPrice / scale */
      discountPrice: number;
      /** discount.discountPercentage = Math.round(discount / originalPrice * 100) */
      discount: number;
      currencyInfo: {
        /** scale = 10 ** decimals */
        decimals: number;
      };
    };
    lineOffers: EpicLineOffer[];
  };
  /** discount.startDate */
  effectiveDate: string;
}

export interface EpicLineOffer {
  appliedRules: EpicOffer[];
}

export interface EpicOffer {
  /** discount.endDate */
  endDate: string;
}

export interface EpicKV {
  key: "publisherName" | "developerName";
  value: string;
}
