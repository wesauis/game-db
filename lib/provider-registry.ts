import { OfferProvider } from "./offer-provider.ts";
import EpicStore from "./providers/epic-store.ts";
import GoG from "./providers/gog.ts";
import Steam from "./providers/steam.ts";

/** All registered providers.
 * 
 * You can add your own just by using `providers.push(yourProvider)`
 */
const providers: OfferProvider[] = [
  new EpicStore("free"),
  new EpicStore("discounted"),
  new GoG("free"),
  new GoG("discounted"),
  new Steam(),
];

export default providers;
