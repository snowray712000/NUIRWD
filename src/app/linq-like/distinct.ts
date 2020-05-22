import { firstOrDefault } from './FirstOrDefault';

export function distinct_linq<T>(data: T[]) {
  const r1: T[] = [];
  for (const it of data) {
    const r2 = firstOrDefault(r1, a1 => a1 === it);
    if (r2 === undefined) {
      r1.push(it);
    }
  }
  return r1;
}
