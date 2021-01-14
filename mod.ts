import providers from "./providers/registry.ts";

if (import.meta.main) {
  const offers = await Promise.all(
    Object
      .values(providers)
      .map((find) => find()),
  )
    // join the results
    .then((offers) => offers.flat())
    // order by discount, descending
    .then((offers) =>
      offers.sort((a, b) =>
        (b.price?.discount || 100) - (a.price?.discount || 100)
      )
    );

  console.log(JSON.stringify(offers, undefined, 2));
}
