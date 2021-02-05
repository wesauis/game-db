export type Mapper<F, T> = (
  value: F,
  index: number,
) => T | undefined | null;

/**
 * Maps F[] to T[] ignoring undefined or null mapper results
 * 
 * @param from 
 * @param mapper 
 */
export function map<F, T>(from: ArrayLike<F>, mapper: Mapper<F, T>) {
  const to: T[] = [];

  for (let index = 0; index < from.length; index += 1) {
    const value = mapper(from[index], index);

    if (value != null) {
      to.push(value);
    }
  }

  return to;
}
