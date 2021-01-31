import type { Offer } from "./types/Offer.d.ts";

export abstract class OfferProvider {
  public readonly id: string;
  constructor(
    public readonly name: string,
    public readonly category: string,
    /** Time between querys in milisseconds */
    public readonly delay: number,
  ) {
    this.id = `${this.name}/${this.category}`;
  }

  /** Returns `true` if out of the query delay */
  public outOfDelay(lastRun: Date): boolean {
    return lastRun.getTime() + this.delay < Date.now();
  }

  /** Search and returns all offers */
  protected abstract _query(): Promise<Offer[]>;

  public async query(
    lastRun: Date,
    force = false,
  ): Promise<Offer[] | "DELAYED"> {
    if (force || this.outOfDelay(lastRun)) {
      return await this._query();
    } else {
      return "DELAYED";
    }
  }
}
