import { logRequestError } from "../logger.ts";
import { GameOffer, OfferProvider } from "../types.d.ts";

const EpicStore: OfferProvider = () => {
  try {
    throw new Error("Not Implemented");
  } catch (error) {
    logRequestError(import.meta, error);
    return new Promise((r) => r([]));
  }
};

export default EpicStore;
