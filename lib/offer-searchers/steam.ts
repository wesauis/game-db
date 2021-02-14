import type { Element } from "../deps.ts";
import type { Offer, OfferSearcher } from "../types/offer.d.ts";
import { map, Mapper } from "../utils/map.ts";
import { parseHTML, parseNum, parseResJson } from "../utils/parsers.ts";

const RESULTS_PER_PAGE = 100;

const STEAM_API_URL = "https://store.steampowered.com/search/results/";

type SteamJSON = {
  results_html: string;
  start: number;
  total_count: number;
};

const toOffer: Mapper<Element, Offer> = (element) => {
  const $discount = element
    .querySelector(".search_discount span")!;

  const [, originalPrice, discountPrice] = element
    .querySelector(".search_price")!
    .textContent.split("R$");

  const { href } = element.attributes;
  const $title = element.querySelector(".title");

  if (
    !originalPrice == null ||
    !discountPrice ||
    !$discount?.textContent ||
    !href ||
    !$title?.textContent
  ) {
    return undefined;
  }

  return {
    title: $title.textContent,
    link: href.replace(/(\?.*)/, ""), // trim url search params
    price: parseNum(originalPrice),
    discount: {
      discountPrice: parseNum(discountPrice),
      discountPercentage: parseNum($discount?.textContent) * -1,
    },
  };
};

export const steam: OfferSearcher = async (limit = 800) => {
  const htmlRows: string[] = [];

  const pageLimit = limit / RESULTS_PER_PAGE;

  const params = new URLSearchParams({
    query: "",
    sort_by: "Reviews_DESC",
    ignore_preferences: "1",
    count: RESULTS_PER_PAGE.toFixed(0),
    dynamic_data: "",
    force_infinite: "1",
    category1: "998",
    specials: "1",
    infinite: "1",
  });

  try {
    let currentPage = 0, totalPages = 0;

    do {
      params.set("start", (currentPage * RESULTS_PER_PAGE).toFixed(0));

      const json = await fetch(`${STEAM_API_URL}?${params.toString()}`)
        .then(parseResJson) as SteamJSON;

      htmlRows.push(json.results_html);

      totalPages = Math.ceil(json.total_count / RESULTS_PER_PAGE);
      currentPage += 1;
    } while (currentPage < totalPages && currentPage < pageLimit);
  } catch (error) {
    console.error(error);
  }

  const html = parseHTML(`<body>${htmlRows.join(" ")}</body>`);

  const elements = html.querySelectorAll(".search_result_row");

  return map(elements as unknown as ArrayLike<Element>, toOffer);
};
