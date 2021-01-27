import type Offer from "./types/Offer.d.ts";

export abstract class OfferProvider {
  public abstract readonly name: string;
  public abstract readonly category: string;

  /**
   * search and returns all offers
   */
  abstract query(): Promise<Offer[]>;
}
