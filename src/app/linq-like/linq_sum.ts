import Enumerable from 'linq';
export function linq_sum<T>(users: T[], fnA?: (a: T) => number): number {
  return Enumerable.from(users).select(a1 => fnA(a1)).sum();
}
