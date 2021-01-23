import { Logger } from "../log/logger.ts";
import GameOffer from "./types/GameOffer.d.ts";

export abstract class GameOfferProvider {
  protected readonly logger: Logger;
  constructor(readonly name: string, readonly category: string) {
    this.logger = new Logger(`${this.name}/${this.category}`);
  }

  /**
   * search and returns all offers
   */
  abstract query(): Promise<GameOffer[]>;
}
