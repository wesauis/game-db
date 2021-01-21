import type { Element } from "../deps.ts";
import { Logger } from "../logging/logger.ts";
import type { GameOfferProvider } from "../provider-registry.ts";
import { register } from "../provider-registry.ts";
import type GameOffer from "../types/GameOffer.d.ts";
import {
  parseElements,
  parseHTML,
  parseNum,
  parseResJson,
} from "../utils/parsers.ts";

const REQUEST_LIMIT = 8;

const STEAM_API_URL =
  "https://store.steampowered.com/search/results/?query&sort_by=Reviews_DESC&ignore_preferences=1&count=100&dynamic_data=&force_infinite=1&category1=998&specials=1&infinite=1";

interface SteamRows {
  results_html: string;
  start: number;
  total_count: number;
}

function f(d: GameOfferProvider) {}

class Steam implements GameOfferProvider {
  name = "steam";
  category = "discounted";
  logger = new Logger(`${this.name}/${this.category}`);

  private static parseGame(game: Element): GameOffer {
    const $title = game.querySelector(".title")!;
    const $discount = game.querySelector(".search_discount span")!;

    const [, sbase, sfinal] = game
      .querySelector(".search_price")!
      .textContent.split("R$");

    return {
      provider: "steam",
      title: $title.textContent,
      price: {
        base: parseNum(sbase),
        final: parseNum(sfinal),
        discount: parseNum($discount.textContent),
      },
      link: game.attributes["href"],
    };
  }

  private async fetchRowsHTML(): Promise<string> {
    const rows: SteamRows[] = [];

    try {
      let current = 0, total = 0;

      do {
        const data = await fetch(
          `${STEAM_API_URL}&start=${current * 100}`,
        ).then(parseResJson<SteamRows>());

        rows.push(data);

        total = Math.ceil(data.total_count / 100);
        current += 1;
        this.logger.info(`fethed games at page ${current} of ${total}`);
      } while (current < total && current < REQUEST_LIMIT);

      if (current < total) {
        // the limit is used to reduce the number of request to the steam server
        // I don't want to abuse
        // and btw, after the 8th page the games are not so great anymore :}
        this.logger.info(`reached page ${REQUEST_LIMIT}, stopping`);
      }
    } catch (error) {
      this.logger.requestError(error);
    }

    return `<body>${
      rows
        .map((row) => row.results_html)
        .join(" ")
    }</body>`;
  }

  async query(): Promise<GameOffer[]> {
    this.logger.info("query started");

    const html = parseHTML(await this.fetchRowsHTML())!;
    const elements = parseElements(html.querySelectorAll(".search_result_row"));

    this.logger.info(`query ended: ${elements.length} games found`);

    return elements.map(Steam.parseGame);
  }
}

register(new Steam());
