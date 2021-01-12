import { EpicStore, EpicStoreFree, Steam } from "./providers/_.ts";

if (import.meta.main) {
  const offers = await Promise.all([
    EpicStore(),
    Steam(),
    EpicStoreFree(),
  ])
    // join the results
    .then((offers) => offers.flat())
    // order by discount, descending
    .then((offers) =>
      offers.sort((a, b) => b.price.discount - a.price.discount)
    );

  console.log(JSON.stringify(offers, undefined, 2));
}
