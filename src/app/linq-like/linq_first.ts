
export function linq_first<T>(data: T[], predicate?: (a: T) => boolean) {
  if (predicate === undefined) {
    if (data === undefined || data.length === 0) {
      return undefined;
    }
    return data[0];
  }

  for (const it of data) {
    if (predicate(it)) {
      return it;
    }
  }
  return undefined;
}


