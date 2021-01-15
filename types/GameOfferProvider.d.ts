import GameOffer from "./GameOffer.d.ts";

export interface GameOfferProvider {
  query(): Promise<GameOffer[]>;
}
