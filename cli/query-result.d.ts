import type { Offer } from "./deps.ts";

export interface QueryResult {
  providers: string[];
  offers: Record<string, Offer[]>;
}
