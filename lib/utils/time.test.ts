import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.84.0/testing/asserts.ts";
import time from "./time.ts";

Deno.test("time conversion", () => {
  assertThrows(() => {
    time(0.5, "DAY"); // must use 12 hours instead
  });

  assertEquals(time(1, "DAY"), 8.64e+7);
  assertEquals(time(2, "DAY"), time(2, "DAYS"));
  assertEquals(time(1, "HOUR"), 3.6e+6);
  assertEquals(time(3, "MINUTES") + time(30, "SECONDS"), 1.8e+5 + 3.0e4);
});
