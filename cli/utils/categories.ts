import { Offer } from "../../lib/lib.ts";
import { map } from "../../lib/utils/map.ts";
import { SearchResults } from "../search-offers.ts";
import { Args } from "./args.ts";

export type OfferAndCategory = Offer & {
  category?: "free" | "discounted" | "ending" | "best-offer";
};

export type CategorizedResults<T extends string | number | symbol = string> =
  Record<T, OfferAndCategory[]>;

export function categorize(
  results: SearchResults,
  options: {
    endingms: Args["endingms"];
    bestOffers: Args["bestOffers"];
    free: Args["free"];
    discounted: Args["discounted"];
  },
): CategorizedResults<keyof typeof results> {
  const categorized: CategorizedResults<keyof typeof results> = {};

  const now = Date.now();
  for (const id in results) {
    categorized[id] = map(results[id], (offer: OfferAndCategory) => {
      if (offer.price !== 0) {
        if (
          options.endingms &&
          offer.discount?.endDate &&
          offer.discount.endDate + options.endingms >= now
        ) {
          offer.category = "ending";
        } else if (options.bestOffers) {
          const [percentage, amount] = options.bestOffers;

          if (percentage != null) {
            const offerPercentage = offer.discount!.discountPercentage;
            if (offerPercentage >= percentage) {
              offer.category = "best-offer";
            }
          } else if (amount != null) {
            const offerSavedAmount = offer.price -
              offer.discount!.discountPrice;
            if (offerSavedAmount >= amount) {
              offer.category = "best-offer";
            }
          }
        }

        if (!offer.category && options.discounted) {
          offer.category = "discounted";
        }
      } else if (options.free) {
        offer.category = "free";
      }

      return offer.category ? offer : undefined;
    });
  }

  return categorized;
}
