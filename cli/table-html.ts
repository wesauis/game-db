import { colorize } from "./colorize.ts";
import { Offer } from "./deps.ts";

function normalize(str: string): string {
  return str.replaceAll(/[^ -~]/g, "");
}

export function* tableHTML(offers: Offer[]) {
  // skeleton css
  yield `<head>
  <title>game-db results</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossorigin="anonymous" />
</head>`;

  // table start
  yield `<body><table style="width:100%">
    <thead>
      <th>Title</th>
      <th>Price</th>
    </thead>
    <tbody>`;

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

    yield `<tr><th>${normalize(title)}</th><th>${formattedPrice}</tr></th>`;
  }

  // table end
  yield `</tbody></table></body>`;
}
