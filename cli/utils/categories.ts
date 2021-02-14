import { Offer } from "../../lib/lib.ts";
import { map } from "../../lib/utils/map.ts";
import { Args } from "./args.ts";

export type OfferAndCategory = Offer & {
  category?: "free" | "discounted" | "ending" | "best-offer";
};

export function categorize(
  results: Record<string, Offer[]>,
  options: {
    endingms: Args["endingms"];
    bestOffers: Args["bestOffers"];
    free: Args["free"];
    discounted: Args["discounted"];
  },
) {
  const categorized: Record<keyof typeof results, OfferAndCategory[]> = {};

  const now = Date.now();
  for (const id in results) {
    categorized[id] = map(results[id], (offer: OfferAndCategory) => {
      const isAlwaysFree = offer.price !== 0;
      if (
        options.endingms &&
        isAlwaysFree && offer.discount?.endDate &&
        offer.discount.endDate + options.endingms >= now
      ) {
        offer.category = "ending";
      } else if (options.bestOffers && isAlwaysFree) {
        const [percentage, amount] = options.bestOffers;

        if (percentage != null) {
          const offerPercentage = offer.discount!.discountPercentage;
          if (offerPercentage > percentage) {
            offer.category = "best-offer";
          }
        } else if (amount != null) {
          const offerSavedAmount = offer.price - offer.discount!.discountPrice;
          if (offerSavedAmount > amount) {
            offer.category = "best-offer";
          }
        }
      } else if (options.free && isAlwaysFree) {
        offer.category = "free";
      } else if (options.discounted) {
        offer.category = "discounted";
      }

      return offer.category ? offer : undefined;
    });
  }

  return categorized;
}
