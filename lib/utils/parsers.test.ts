import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { parseNum } from "./parsers.ts";

Deno.test("parseNum", () => {
  assertEquals(parseNum("4,34"), 4.34, "comma instead of dot");
  assertEquals(parseNum(" 26,59"), 26.59, "space");
  assertEquals(parseNum(" 13  ,507"), 13.507, "spaces");
  assertEquals(parseNum("15.8"), 15.8, "nothing wrong");
  assertEquals(parseNum("1"), 1, "integer");
  assertEquals(parseNum("-30%"), -30, "negative percentage");
  assertEquals(parseNum("USD 3.000,6"), 3000.6);
});
