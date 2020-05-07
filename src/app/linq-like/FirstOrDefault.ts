
export function firstOrDefault<T>(data: T[], predicate: (a: T) => boolean) {
  for (const it of data) {
    if (predicate(it)) {
      return it;
    }
  }
  return undefined;
}
