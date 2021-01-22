import { Logger } from "./logging/logger.ts";
import GameOffer from "./types/GameOffer.d.ts";

export abstract class GameOfferProvider {
  protected readonly logger: Logger;
  constructor(readonly name: string, readonly category: string) {
    this.logger = new Logger(`${this.name}/${this.category}`);
  }

  abstract query(): Promise<GameOffer[]>;
}
