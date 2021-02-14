import { assertEquals } from "https://deno.land/std@0.85.0/testing/asserts.ts";
import { map } from "./map.ts";

Deno.test("map", () => {
  assertEquals(map(["1", "2", "3"], (n) => +n), [1, 2, 3]);
});
