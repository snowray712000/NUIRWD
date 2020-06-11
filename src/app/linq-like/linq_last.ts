export function linq_last<T>(data: T[]) {
  if (data === undefined || data.length === 0) {
    return undefined;
  }
  return data[data.length - 1];
}
