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

interface SteamRows {
  results_html: string;
  start: number;
  total_count: number;
}

export default class Steam extends OfferProvider {
  public readonly name = "steam";
  public readonly category = "discounted";
  public readonly delay = time(18, "HOURS");

  private static parseGame(game: Element): Offer {
    const $title = game.querySelector(".title")!;
    const $discount = game.querySelector(".search_discount span")!;

    const [, sbase, sfinal] = game
      .querySelector(".search_price")!
      .textContent.split("R$");

    try {
      return {
        provider: "steam",
        title: $title.textContent,
        price: {
          base: parseNum(sbase || "0"),
          final: parseNum(sfinal || "0"),
          discount: parseNum($discount?.textContent || "0"),
        },
        link: game.attributes["href"],
      };
    } catch (err) {
      console.error(`<html>${game.innerHTML}</html>`);
      throw err;
    }
  }

  private async fetchRowsHTML(): Promise<string> {
    const rows: SteamRows[] = [];

    try {
      let current = 0, total = 0;

      do {
        const data = await fetch(
          `${STEAM_API_URL}&start=${current * 100}`,
        ).then(parseResJson) as SteamRows;

        rows.push(data);

        total = Math.ceil(data.total_count / 100);
        current += 1;
      } while (current < total && current < REQUEST_LIMIT);
    } catch (error) {
      console.error(error);
    }

    return `<body>${
      rows
        .map((row) => row.results_html)
        .join(" ")
    }</body>`;
  }

  async _query(): Promise<Offer[]> {
    const html = parseHTML(await this.fetchRowsHTML());
    const elements = parseElements(html.querySelectorAll(".search_result_row"));

    return elements.map(Steam.parseGame);
  }
}
