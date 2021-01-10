export function parseJSON<T>() {
  return (res: Response): Promise<T> => {
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw res;
    }
  };
}
