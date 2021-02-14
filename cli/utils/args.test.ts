import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.85.0/testing/asserts.ts";
import {
  _bestOffers,
  _endingms,
  _json,
  _searcherIdMatch,
  InvalidArgument,
  parseArgs,
} from "./args.ts";

if (import.meta.main) {
  // sandbox
  console.log(parseArgs({
    endingms: 36 * 60 * 60 * 1000,
    bestOffers: [90, 80],
  }));
}

Deno.test("json", () => {
  assertEquals(_json(undefined), undefined, "no arg");
  assertEquals(_json(""), "raw", "--json");
  assertEquals(_json("raw"), "raw", "--json raw");
  assertEquals(_json("pretty"), "pretty", "--json pretty");

  assertThrows(
    () => {
      _json(Math.random().toString(36));
    },
    InvalidArgument,
    undefined,
    "anything else",
  );
});

Deno.test("match-regex", () => {
  assertEquals(_searcherIdMatch(undefined), undefined, "no arg");
  assertEquals(_searcherIdMatch(".*"), /.*/i, "regex");

  assertThrows(
    () => {
      _searcherIdMatch("");
    },
    InvalidArgument,
    undefined,
    "empty",
  );

  assertThrows(
    () => {
      _searcherIdMatch("[");
    },
    InvalidArgument,
    undefined,
    "invalid regex",
  );
});

Deno.test("endingms", () => {
  const default_ = -1;

  assertEquals(_endingms(undefined, default_), undefined, "no arg");
  assertEquals(_endingms("", default_), default_, "default");
  assertEquals(_endingms("55", default_), 55, "no arg");

  assertThrows(
    () => {
      _endingms("this is not a number", default_);
    },
    InvalidArgument,
    undefined,
    "not a number",
  );
});

Deno.test("best-offers", () => {
  const default_ = [5, 6] as [number, number];

  assertEquals(_bestOffers(undefined, default_), default_, "no arg");
  assertEquals(_bestOffers("", default_), default_, "empty");
  assertEquals(_bestOffers("hide", default_), undefined, "hide");
  assertEquals(_bestOffers("100", default_), [100, undefined], "perc");
  assertEquals(_bestOffers("96,5", default_), [96, 5], "perc,int");
  assertEquals(_bestOffers("45,8.5", default_), [45, 8.5], "perc,float");
  assertEquals(_bestOffers(",12", default_), [undefined, 12], ",int");
  assertEquals(_bestOffers(",13.345", default_), [undefined, 13.345], ",float");

  assertThrows(
    () => {
      _bestOffers("101", default_);
    },
    InvalidArgument,
    undefined,
    "over 100",
  );

  assertThrows(
    () => {
      _bestOffers("foo,90", default_);
    },
    InvalidArgument,
    undefined,
    "not a number",
  );

  assertThrows(
    () => {
      _bestOffers(",", default_);
    },
    InvalidArgument,
    undefined,
    "just comma",
  );
});
