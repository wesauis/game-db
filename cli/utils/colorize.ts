export type RGB = [number, number, number];

/**
 * Returns a color from red(0% discount) to green(free)
 * 
 * @param value 
 * @param percentage 
 */
export function colorize(percentage: number): RGB {
  // scalles the value from 0-100 to 0-255
  const scalled = Math.floor(Math.max(percentage * 2.55, 0));

  // gets a color in the range from red to green
  const r = 256 - scalled;
  const g = scalled;
  const b = 0;

  return [r, g, b];
}
