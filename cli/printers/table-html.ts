import { CategorizedResults, OfferAndCategory } from "../utils/categories.ts";
import { colorize } from "../utils/colorize.ts";

function normalize(str: string): string {
  return str.replaceAll(/[^ -~]/g, "");
}

const CATEGORY: Record<NonNullable<OfferAndCategory["category"]>, string> = {
  ending: "  ending  ".fontcolor("darkorange"),
  "best-offer": "best-offer".fontcolor("purple"),
  free: "   free   ".fontcolor("gray"),
  discounted: "discounted".fontcolor("darkblue"),
};

export function* tableHTML(searchResults: CategorizedResults) {
  // skeleton css
  yield `<head>
  <title>game-db results</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossorigin="anonymous" />
</head>`;

  // table start
  yield `<body style='background-color:#121212;filter: invert(1) hue-rotate(180deg);'>
    <table style="width:100%">
    <thead>
      <th>Category</th>
      <th>Title</th>
      <th>Price</th>
    </thead>
    <tbody>`;

  const offers = Object
    .values(searchResults)
    .flat() // order: free-forever, 100 - 0
    .sort((offer0, offer1) => {
      const p0 = !offer0.price
        ? 101
        : offer0.discount?.discountPercentage || 100;
      const p1 = !offer1.price
        ? 101
        : offer1.discount?.discountPercentage || 100;

      return p1 - p0;
    });

  // content
  for (const offer of offers) {
    const title =
      `<a target="_blank" rel="noopener noreferrer" href="${offer.link}">${offer.title}</a>`;

    let formattedPrice: string;
    const { price } = offer;

    if (!price) {
      formattedPrice = "free".fontcolor("#00ff00");
    } else {
      const { discountPrice, discountPercentage } = offer.discount!;
      const [r, g, b] = colorize(discountPercentage);

      formattedPrice = `${
        discountPrice.toFixed(2)
      } ${`<span style="color: rgb(${r},${g},${b})">-${discountPercentage}%</span>`}`;
    }

    yield `<tr><th>${CATEGORY[offer.category!]}</th><th>${
      normalize(title)
    }</th><th>${formattedPrice}</tr></th>`;
  }

  // table end
  yield `</tbody></table></body>`;
}
