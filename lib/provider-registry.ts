import { GameOfferProvider } from "./GameOfferProvider.ts";
import EpicStore from "./providers/EpicStore.ts";
import GoG from "./providers/GoG.ts";
import Steam from "./providers/Steam.ts";

/**
 * All registered providers.
 * 
 * You can add your own just by using `providers.push(yourProvider)`
 */
const providers: GameOfferProvider[] = [
  new EpicStore("free"),
  new EpicStore("discounted"),
  new GoG("free"),
  new GoG("discounted"),
  new Steam(),
];

export default providers;
