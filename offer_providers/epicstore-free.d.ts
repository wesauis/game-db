export default interface EpicStoreFreeJson {
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
  seller: Seller;
  productSlug: string;
  urlSlug: string;
  url?: unknown;
  items: Item[];
  customAttributes: CustomAttribute[];
  categories: Category[];
  tags: Tag[];
  price: Price;
  promotions?: Promotion;
}

interface Promotion {
  promotionalOffers: PromotionalOffer2[];
  upcomingPromotionalOffers: PromotionalOffer2[];
}

interface PromotionalOffer2 {
  promotionalOffers: PromotionalOffer[];
}

interface PromotionalOffer {
  startDate: string;
  endDate: string;
  discountSetting: DiscountSetting2;
}

interface DiscountSetting2 {
  discountType: string;
  discountPercentage: number;
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

interface Tag {
  id: string;
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

interface Seller {
  id: string;
  name: string;
}

interface KeyImage {
  type: string;
  url: string;
}

/*
  Example response:

  {
    "data": {
      "Catalog": {
        "searchStore": {
          "elements": [
            {
              "title": "Crying Suns",
              "id": "462844c5fc104812a53792c42d400644",
              "namespace": "0a4fc789eb0143c29296de79df5387ab",
              "description": "Crying Suns",
              "effectiveDate": "2021-01-07T16:00:00.000Z",
              "keyImages": [
                {
                  "type": "OfferImageWide",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S1-2560x1440-fe76927669c4b3d6e03da9d614693a9c.jpg"
                },
                {
                  "type": "OfferImageTall",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S2-1200x1600-cade755556a8d2b988626591b9464449.jpg"
                },
                {
                  "type": "Thumbnail",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S2-1200x1600-cade755556a8d2b988626591b9464449.jpg"
                },
                {
                  "type": "CodeRedemption_340x440",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S2-1200x1600-cade755556a8d2b988626591b9464449.jpg"
                },
                {
                  "type": "DieselStoreFrontWide",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S1-2560x1440-fe76927669c4b3d6e03da9d614693a9c.jpg"
                },
                {
                  "type": "DieselStoreFrontTall",
                  "url": "https://cdn1.epicgames.com/0a4fc789eb0143c29296de79df5387ab/offer/EGS_CryingSunsisatacticalroguelite_AltShift_S2-1200x1600-cade755556a8d2b988626591b9464449.jpg"
                }
              ],
              "seller": {
                "id": "o-pldxyabsslnt6jth2z634mmr2pw8lu",
                "name": "Humble Bundle"
              },
              "productSlug": "crying-suns",
              "urlSlug": "crying-suns--home",
              "url": null,
              "items": [
                {
                  "id": "f6fad7274df245dfb59ca1e16a385c52",
                  "namespace": "0a4fc789eb0143c29296de79df5387ab"
                }
              ],
              "customAttributes": [
                {
                  "key": "com.epicgames.app.blacklist",
                  "value": "[]"
                },
                {
                  "key": "publisherName",
                  "value": "Humble Games"
                },
                {
                  "key": "developerName",
                  "value": "Alt Shift"
                },
                {
                  "key": "com.epicgames.app.productSlug",
                  "value": "crying-suns"
                }
              ],
              "categories": [
                {
                  "path": "freegames"
                },
                {
                  "path": "games"
                },
                {
                  "path": "games/edition"
                },
                {
                  "path": "games/edition/base"
                },
                {
                  "path": "applications"
                }
              ],
              "tags": [
                {
                  "id": "1367"
                },
                {
                  "id": "1258"
                },
                {
                  "id": "1370"
                },
                {
                  "id": "1115"
                },
                {
                  "id": "9547"
                },
                {
                  "id": "10719"
                }
              ],
              "price": {
                "totalPrice": {
                  "discountPrice": 0,
                  "originalPrice": 4799,
                  "voucherDiscount": 0,
                  "discount": 4799,
                  "currencyCode": "BRL",
                  "currencyInfo": {
                    "decimals": 2
                  },
                  "fmtPrice": {
                    "originalPrice": "R$47.99",
                    "discountPrice": "0",
                    "intermediatePrice": "0"
                  }
                },
                "lineOffers": [
                  {
                    "appliedRules": [
                      {
                        "id": "616f02cefe1d4b1bba795acf2b09b038",
                        "endDate": "2021-01-14T16:00:00.000Z",
                        "discountSetting": {
                          "discountType": "PERCENTAGE"
                        }
                      }
                    ]
                  }
                ]
              },
              "promotions": {
                "promotionalOffers": [
                  {
                    "promotionalOffers": [
                      {
                        "startDate": "2021-01-07T16:00:00.000Z",
                        "endDate": "2021-01-14T16:00:00.000Z",
                        "discountSetting": {
                          "discountType": "PERCENTAGE",
                          "discountPercentage": 0
                        }
                      }
                    ]
                  }
                ],
                "upcomingPromotionalOffers": []
              }
            },
            {
              "title": "STAR WARS™ Battlefront™ II: Celebration Edition",
              "id": "ea7721c6c2694e72813d3661bc68a2cb",
              "namespace": "b156c3365a5b4cb9a01a5e1108b4e3f4",
              "description": "STAR WARS™ Battlefront™ II: Celebration Edition",
              "effectiveDate": "2021-01-14T16:00:00.000Z",
              "keyImages": [
                {
                  "type": "OfferImageWide",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S1-2560x1440-3dc68a07cace02e826ad42a2de5279b0.jpg"
                },
                {
                  "type": "OfferImageTall",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S2-1200x1600-11d040719a8457bbf36cabbe89b200db.jpg"
                },
                {
                  "type": "Thumbnail",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S2-1200x1600-11d040719a8457bbf36cabbe89b200db.jpg"
                },
                {
                  "type": "DieselStoreFrontWide",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S1-2560x1440-3dc68a07cace02e826ad42a2de5279b0.jpg"
                },
                {
                  "type": "DieselStoreFrontTall",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S2-1200x1600-11d040719a8457bbf36cabbe89b200db.jpg"
                },
                {
                  "type": "CodeRedemption_340x440",
                  "url": "https://cdn1.epicgames.com/b156c3365a5b4cb9a01a5e1108b4e3f4/offer/EGS_STARWARSBattlefrontIICelebrationEdition_DICE_S2-1200x1600-11d040719a8457bbf36cabbe89b200db.jpg"
                }
              ],
              "seller": {
                "id": "o-vtqh9b4lk8n4jpadfv6cphqs9hsly9",
                "name": "Electronic Arts"
              },
              "productSlug": "star-wars-battlefront-2",
              "urlSlug": "star-wars-battlefront2",
              "url": null,
              "items": [
                {
                  "id": "677938c995794ceba53bc6a36885f2a6",
                  "namespace": "b156c3365a5b4cb9a01a5e1108b4e3f4"
                }
              ],
              "customAttributes": [
                {
                  "key": "com.epicgames.app.blacklist",
                  "value": "[]"
                },
                {
                  "key": "publisherName",
                  "value": "Electronic Arts"
                },
                {
                  "key": "developerName",
                  "value": "DICE"
                },
                {
                  "key": "com.epicgames.app.productSlug",
                  "value": "star-wars-battlefront-2"
                }
              ],
              "categories": [
                {
                  "path": "freegames"
                },
                {
                  "path": "games"
                },
                {
                  "path": "applications"
                }
              ],
              "tags": [
                {
                  "id": "1216"
                },
                {
                  "id": "1264"
                },
                {
                  "id": "1203"
                },
                {
                  "id": "1210"
                },
                {
                  "id": "1370"
                },
                {
                  "id": "9547"
                },
                {
                  "id": "1117"
                }
              ],
              "price": {
                "totalPrice": {
                  "discountPrice": 15900,
                  "originalPrice": 15900,
                  "voucherDiscount": 0,
                  "discount": 0,
                  "currencyCode": "BRL",
                  "currencyInfo": {
                    "decimals": 2
                  },
                  "fmtPrice": {
                    "originalPrice": "R$159.00",
                    "discountPrice": "R$159.00",
                    "intermediatePrice": "R$159.00"
                  }
                },
                "lineOffers": [
                  {
                    "appliedRules": []
                  }
                ]
              },
              "promotions": {
                "promotionalOffers": [],
                "upcomingPromotionalOffers": [
                  {
                    "promotionalOffers": [
                      {
                        "startDate": "2021-01-14T16:00:00.000Z",
                        "endDate": "2021-01-21T16:00:00.000Z",
                        "discountSetting": {
                          "discountType": "PERCENTAGE",
                          "discountPercentage": 0
                        }
                      }
                    ]
                  }
                ]
              }
            },
            {
              "title": "Jurassic World Evolution",
              "id": "e58e33fc6aa449469b6d2fe02f52e4e4",
              "namespace": "d5241c76f178492ea1540fce45616757",
              "description": "Jurassic World Evolution",
              "effectiveDate": "2099-01-01T00:00:00.000Z",
              "keyImages": [
                {
                  "type": "VaultClosed",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_31_1920x1080_Teaser-1920x1080-68876bdc4a75589c69e221b6a00581a3.jpg"
                },
                {
                  "type": "DieselStoreFrontWide",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_JurassicWorldEvolution_1920x1080_Teaser-R-1920x1080-26f66b9b2bc29ce9bf2b87abe2efbfab.jpg"
                }
              ],
              "seller": {
                "id": "o-ufmrk5furrrxgsp5tdngefzt5rxdcn",
                "name": "Epic Dev Test Account"
              },
              "productSlug": "jurassic-world-evolution",
              "urlSlug": "december31mysterygame",
              "url": null,
              "items": [
                {
                  "id": "8341d7c7e4534db7848cc428aa4cbe5a",
                  "namespace": "d5241c76f178492ea1540fce45616757"
                }
              ],
              "customAttributes": [
                {
                  "key": "com.epicgames.app.freegames.vault.close",
                  "value": "[]"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.slug",
                  "value": "news/the-holiday-sale-returns-on-december-17-plus-15-free-games"
                },
                {
                  "key": "com.epicgames.app.blacklist",
                  "value": "[]"
                },
                {
                  "key": "publisherName",
                  "value": "Frontier Developments"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.open",
                  "value": "[]"
                },
                {
                  "key": "developerName",
                  "value": "Frontier Developments"
                },
                {
                  "key": "com.epicgames.app.productSlug",
                  "value": "jurassic-world-evolution"
                }
              ],
              "categories": [
                {
                  "path": "freegames/vaulted"
                },
                {
                  "path": "freegames"
                },
                {
                  "path": "games"
                },
                {
                  "path": "applications"
                }
              ],
              "tags": [],
              "price": {
                "totalPrice": {
                  "discountPrice": 0,
                  "originalPrice": 0,
                  "voucherDiscount": 0,
                  "discount": 0,
                  "currencyCode": "BRL",
                  "currencyInfo": {
                    "decimals": 2
                  },
                  "fmtPrice": {
                    "originalPrice": "0",
                    "discountPrice": "0",
                    "intermediatePrice": "0"
                  }
                },
                "lineOffers": [
                  {
                    "appliedRules": []
                  }
                ]
              },
              "promotions": null
            },
            {
              "title": "Torchlight II",
              "id": "af887062235447459380559888ee5b97",
              "namespace": "d5241c76f178492ea1540fce45616757",
              "description": "Torchlight II",
              "effectiveDate": "2099-01-01T00:00:00.000Z",
              "keyImages": [
                {
                  "type": "VaultClosed",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_30_1920x1080_Teaser-1920x1080-0bb081e7879c49cd68f242c49a2ec55c.jpg"
                },
                {
                  "type": "DieselStoreFrontWide",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_TorchlightII_1920x1080_Teaser-R-1920x1080-f6aec62524340cff0d7489f7fee95b87.jpg"
                }
              ],
              "seller": {
                "id": "o-ufmrk5furrrxgsp5tdngefzt5rxdcn",
                "name": "Epic Dev Test Account"
              },
              "productSlug": "torchlight-2",
              "urlSlug": "december30mysterygame",
              "url": null,
              "items": [
                {
                  "id": "8341d7c7e4534db7848cc428aa4cbe5a",
                  "namespace": "d5241c76f178492ea1540fce45616757"
                }
              ],
              "customAttributes": [
                {
                  "key": "com.epicgames.app.freegames.vault.close",
                  "value": "[]"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.slug",
                  "value": "news/the-holiday-sale-returns-on-december-17-plus-15-free-games"
                },
                {
                  "key": "com.epicgames.app.blacklist",
                  "value": "[]"
                },
                {
                  "key": "publisherName",
                  "value": "Perfect World Entertainment"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.open",
                  "value": "[]"
                },
                {
                  "key": "developerName",
                  "value": "Runic Games"
                },
                {
                  "key": "com.epicgames.app.productSlug",
                  "value": "torchlight-2"
                }
              ],
              "categories": [
                {
                  "path": "freegames/vaulted"
                },
                {
                  "path": "freegames"
                },
                {
                  "path": "games"
                },
                {
                  "path": "applications"
                }
              ],
              "tags": [],
              "price": {
                "totalPrice": {
                  "discountPrice": 0,
                  "originalPrice": 0,
                  "voucherDiscount": 0,
                  "discount": 0,
                  "currencyCode": "BRL",
                  "currencyInfo": {
                    "decimals": 2
                  },
                  "fmtPrice": {
                    "originalPrice": "0",
                    "discountPrice": "0",
                    "intermediatePrice": "0"
                  }
                },
                "lineOffers": [
                  {
                    "appliedRules": []
                  }
                ]
              },
              "promotions": null
            },
            {
              "title": "Stranded Deep",
              "id": "45fffdd898b543cfaadb6072d9dfaa58",
              "namespace": "d5241c76f178492ea1540fce45616757",
              "description": "Stranded Deep",
              "effectiveDate": "2099-01-01T00:00:00.000Z",
              "keyImages": [
                {
                  "type": "VaultClosed",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_28_1920x1080_Teaser-1920x1080-cf3e4beebe9d0a36064acf6d0bdb3217.jpg"
                },
                {
                  "type": "DieselStoreFrontWide",
                  "url": "https://cdn1.epicgames.com/d5241c76f178492ea1540fce45616757/offer/EGS_HolidaySale2020_DoG_StrandedDeep_1920x1080_Teaser-R-1920x1080-0b2d3e3f9f64712b216a98091e3cb4f8.jpg"
                }
              ],
              "seller": {
                "id": "o-ufmrk5furrrxgsp5tdngefzt5rxdcn",
                "name": "Epic Dev Test Account"
              },
              "productSlug": "stranded-deep/home",
              "urlSlug": "december28mysterygame",
              "url": null,
              "items": [
                {
                  "id": "8341d7c7e4534db7848cc428aa4cbe5a",
                  "namespace": "d5241c76f178492ea1540fce45616757"
                }
              ],
              "customAttributes": [
                {
                  "key": "com.epicgames.app.freegames.vault.close",
                  "value": "[]"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.slug",
                  "value": "news/the-holiday-sale-returns-on-december-17-plus-15-free-games"
                },
                {
                  "key": "com.epicgames.app.blacklist",
                  "value": "[]"
                },
                {
                  "key": "publisherName",
                  "value": "Beam Team Publishing"
                },
                {
                  "key": "com.epicgames.app.freegames.vault.open",
                  "value": "[]"
                },
                {
                  "key": "developerName",
                  "value": "Beam Team Games"
                },
                {
                  "key": "com.epicgames.app.productSlug",
                  "value": "stranded-deep/home"
                }
              ],
              "categories": [
                {
                  "path": "freegames/vaulted"
                },
                {
                  "path": "freegames"
                },
                {
                  "path": "games"
                },
                {
                  "path": "applications"
                }
              ],
              "tags": [],
              "price": {
                "totalPrice": {
                  "discountPrice": 0,
                  "originalPrice": 0,
                  "voucherDiscount": 0,
                  "discount": 0,
                  "currencyCode": "BRL",
                  "currencyInfo": {
                    "decimals": 2
                  },
                  "fmtPrice": {
                    "originalPrice": "0",
                    "discountPrice": "0",
                    "intermediatePrice": "0"
                  }
                },
                "lineOffers": [
                  {
                    "appliedRules": []
                  }
                ]
              },
              "promotions": null
            }
          ],
          "paging": {
            "count": 1000,
            "total": 5
          }
        }
      }
    },
    "extensions": {
      "cacheControl": {
        "version": 1,
        "hints": [
          {
            "path": [
              "Catalog"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "paging"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "keyImages"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "seller"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "items"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "customAttributes"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "categories"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "tags"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "promotions"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "keyImages"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "seller"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "items"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "customAttributes"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "categories"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "tags"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "promotions"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "keyImages"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "seller"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "items"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "customAttributes"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "categories"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "tags"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "promotions"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "keyImages"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "seller"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "items"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "customAttributes"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "categories"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "tags"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "promotions"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "keyImages"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "seller"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "items"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "customAttributes"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "categories"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "tags"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "promotions"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "lineOffers"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "discountPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "originalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "voucherDiscount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "discount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "currencyCode"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "currencyInfo"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "totalPrice",
              "fmtPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              3,
              "price",
              "lineOffers",
              0,
              "appliedRules"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "lineOffers"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "discountPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "originalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "voucherDiscount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "discount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "currencyCode"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "currencyInfo"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "totalPrice",
              "fmtPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              4,
              "price",
              "lineOffers",
              0,
              "appliedRules"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "discountPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "originalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "voucherDiscount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "discount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "currencyCode"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "currencyInfo"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "totalPrice",
              "fmtPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers",
              0,
              "appliedRules"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers",
              0,
              "appliedRules",
              0,
              "id"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers",
              0,
              "appliedRules",
              0,
              "endDate"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers",
              0,
              "appliedRules",
              0,
              "discountSetting"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "price",
              "lineOffers",
              0,
              "appliedRules",
              0,
              "discountSetting",
              "discountType"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "promotions",
              "promotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "promotions",
              "upcomingPromotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "promotions",
              "promotionalOffers",
              0,
              "promotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              0,
              "promotions",
              "promotionalOffers",
              0,
              "promotionalOffers",
              0,
              "discountSetting"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "lineOffers"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "discountPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "originalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "voucherDiscount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "discount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "currencyCode"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "currencyInfo"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "totalPrice",
              "fmtPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "price",
              "lineOffers",
              0,
              "appliedRules"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "lineOffers"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "discountPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "originalPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "voucherDiscount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "discount"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "currencyCode"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "currencyInfo"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "totalPrice",
              "fmtPrice"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              2,
              "price",
              "lineOffers",
              0,
              "appliedRules"
            ],
            "maxAge": 600,
            "scope": "PUBLIC"
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "promotions",
              "promotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "promotions",
              "upcomingPromotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "promotions",
              "upcomingPromotionalOffers",
              0,
              "promotionalOffers"
            ],
            "maxAge": 0
          },
          {
            "path": [
              "Catalog",
              "searchStore",
              "elements",
              1,
              "promotions",
              "upcomingPromotionalOffers",
              0,
              "promotionalOffers",
              0,
              "discountSetting"
            ],
            "maxAge": 0
          }
        ]
      }
    }
  }

 */