import { colorize } from "./colorize.ts";
import { colors, Offer } from "./deps.ts";

function normalize(str: string): string {
  return str.replaceAll(/[^ -~]/g, "");
}

/** retuns the spaces to make a string the desidered size, ignoring scape colors */
function padRight(str: string, size: number): string {
  // deno-lint-ignore no-control-regex
  const width = str.replace(/\x1b\[[^\x1b]+m/g, "").length - 1;
  return new Array(Math.max(size - width, 0)).join(" ") + str;
}

export function* table(offers: Offer[]) {
  const widths: number[] = [5, 5];
  const rows: string[][] = [];

  offers.forEach((offer) => {
    const title = normalize(offer.title);
    if (widths[0] <= title.length) {
      widths[0] = title.length;
    }

    const { discount = 100, final = 0 } = offer.price || {};
    let price: string;
    if (discount === 100) {
      price = colors.rgb24("free", 0x00ff00);
    } else {
      const [r, g, b] = colorize(final, discount);

      const price_ = final.toFixed(2);
      const discount_ = `-${discount}%`;

      const width = price_.length + discount_.length + 2;
      if (widths[1] < title.length) {
        widths[1] = width;
      }

      price = `${price_} ${colors.rgb24(discount_, { r, g, b })}`;
    }

    rows.push([title, price, offer.link]);
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
