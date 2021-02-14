import { colors } from "../deps.ts";
import { SearchResults } from "../search-offers.ts";
import { colorize } from "../utils/colorize.ts";

function normalize(str: string): string {
  return str.replaceAll(/[^ -~]/g, "");
}

/** retuns the spaces to make a string the desidered size, ignoring scape colors */
function padRight(str: string, size: number): string {
  // deno-lint-ignore no-control-regex
  const width = str.replace(/\x1b\[[^\x1b]+m/g, "").length - 1;
  return new Array(Math.max(size - width, 0)).join(" ") + str;
}

const TITLE = 0, PRICE = 1;

export function* table(searchResults: SearchResults) {
  const widths: number[] = [5, 5];
  const rows: string[][] = [];

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

  offers.forEach((offer) => {
    const title = normalize(offer.title);
    if (widths[TITLE] <= title.length) {
      widths[TITLE] = title.length;
    }

    let formattedPrice: string;

    const { price } = offer;
    if (!price) {
      formattedPrice = colors.rgb24("free", 0x00ff00);
    } else {
      const { discountPrice, discountPercentage } = offer.discount!;
      const [r, g, b] = colorize(discountPercentage);

      const price = discountPrice.toFixed(2);
      const percentage = `-${discountPercentage}%`;

      const width = price.length + percentage.length + 1;
      if (widths[PRICE] < width) {
        widths[PRICE] = width;
      }

      formattedPrice = `${price} ${colors.rgb24(percentage, { r, g, b })}`;
    }

    rows.push([title, formattedPrice, offer.link]);
  });

  const [titleW, priceW] = widths;

  const COLUMN_SEPARATOR = colors.dim(" | ");

  yield [
    "Title".padEnd(titleW),
    "Price".padEnd(priceW),
    "Link",
  ].map(colors.bold)
    .join(COLUMN_SEPARATOR);

  for (const [title, price, link] of rows) {
    yield [
      title.padEnd(titleW),
      padRight(price, priceW),
      link,
    ].join(COLUMN_SEPARATOR);
  }
}
