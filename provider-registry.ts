import { GameOfferProvider } from "./GameOfferProvider.ts";
import { Logger } from "./logging/logger.ts";
import EpicStore from "./providers/EpicStore.ts";
import GoG from "./providers/GoG.ts";
import Steam from "./providers/Steam.ts";
import type GameOffer from "./types/GameOffer.d.ts";

const providers: GameOfferProvider[] = [
  new EpicStore("free"),
  new EpicStore("discounted"),
  new GoG("free"),
  new GoG("discounted"),
  new Steam(),
];

export default providers;
