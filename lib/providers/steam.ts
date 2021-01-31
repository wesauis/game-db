import type { Element } from "../deps.ts";
import { OfferProvider } from "../offer-provider.ts";
import type { Offer } from "../types/Offer.d.ts";
import {
  parseElements,
  parseHTML,
  parseNum,
  parseResJson,
} from "../utils/parsers.ts";
import time from "../utils/time.ts";

const REQUEST_LIMIT = 8;

const STEAM_API_URL =
  "https://store.steampowered.com/search/results/?query&sort_by=Reviews_DESC&ignore_preferences=1&count=100&dynamic_data=&force_infinite=1&category1=998&specials=1&infinite=1";

interface SteamJSON {
  results_html: string;
  start: number;
  total_count: number;
}

function trimSearchParams(url: string): string {
  const questionMarkIndex = url.lastIndexOf("?") - 1;
  if (questionMarkIndex < 0) return url;
  else return url.substring(0, questionMarkIndex);
}

export default class Steam extends OfferProvider {
  constructor() {
    super("steam", "discounted", time(18, "HOURS"));
  }

  async _query(): Promise<Offer[]> {
    const html = parseHTML(await this.fetchHTMLRows());
    const elements = parseElements(html.querySelectorAll(".search_result_row"));

    const offers: Offer[] = [];
    elements.forEach((element) => {
      const offer = this.toOffer(element);
      if (offer) {
        offers.push(offer);
      }
    });
    return offers;
  }

  private async fetchHTMLRows(): Promise<string> {
    const htmlRows: string[] = [];

    try {
      let current = 0, total = 0;

      do {
        const json = await fetch(
          `${STEAM_API_URL}&start=${current * 100}`,
        ).then(parseResJson) as SteamJSON;

        htmlRows.push(json.results_html);

        total = Math.ceil(json.total_count / 100);
        current += 1;
      } while (current < total && current < REQUEST_LIMIT);
    } catch (error) {
      console.error(error);
    }

    return `<body>${htmlRows.join(" ")}</body>`;
  }

  private toOffer(element: Element): Offer | undefined {
    const $discount = element.querySelector(".search_discount span")!;
    const [, originalPrice, discountPrice] = element
      .querySelector(".search_price")!
      .textContent.split("R$");

    // if price, discounted price or discount is missing, is not a offer
    if (!originalPrice == null || !discountPrice || !$discount?.textContent) {
      return undefined;
    }

    const $title = element.querySelector(".title")!;

    try {
      return {
        title: $title.textContent,
        link: trimSearchParams(element.attributes["href"]),
        price: parseNum(originalPrice),
        discount: {
          discountPrice: parseNum(discountPrice),
          discountPercentage: parseNum($discount?.textContent),
        },
      };
    } catch (err) {
      console.error(`<html>${element.innerHTML}</html>`);
      throw err;
    }
  }
}
