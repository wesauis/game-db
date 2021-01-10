export function getJSON<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json() as Promise<T>
  } else {
    throw res
  }
}