export type Mapper<F, T> = (
  value: F,
  index: number,
  array: F[],
) => T | undefined | null;

/**
 * Maps F[] to T[] ignoring undefined or null mapper results
 * 
 * @param from 
 * @param mapper 
 */
// TODO F just need to have to be mappable
export function map<F, T>(from: F[], mapper: Mapper<F, T>) {
  const to: T[] = [];

  // TODO use a for loop
  from.forEach((value, index, array) => {
    const mappedValue = mapper(value, index, array);

    if (mappedValue != null) {
      to.push(mappedValue);
    }
  });

  return to;
}
