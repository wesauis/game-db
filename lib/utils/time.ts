// deno-lint-ignore-file
export type TimeUnit =
  | "DAY"
  | "HOUR"
  | "MINUTE"
  | "SECOND"
  | "DAYS"
  | "HOURS"
  | "MINUTES"
  | "SECONDS";

export default function time(ammount: number, unit: TimeUnit) {
  if (!Number.isInteger(ammount)) {
    throw new Error("ammount is not a integer");
  }

  let result = ammount;
  switch (unit) {
    case "DAY":
    case "DAYS":
      result *= 24;
    case "HOUR":
    case "HOURS":
      result *= 60;
    case "MINUTE":
    case "MINUTES":
      result *= 60;
    case "SECOND":
    case "SECONDS":
      result *= 1000;
      return result;
    default:
      throw `unknown unit: ${unit}`;
  }
}
