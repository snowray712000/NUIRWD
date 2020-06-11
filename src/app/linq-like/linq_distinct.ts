import { linq_first } from './linq_first';

export function linq_distinct<T>(data: T[]) {
  const r1: T[] = [];
  for (const it of data) {
    const r2 = linq_first(r1, a1 => a1 === it);
    if (r2 === undefined) {
      r1.push(it);
    }
  }
  return r1;
}
