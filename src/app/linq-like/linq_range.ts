import Enumerable from 'linq';
export function linq_range(i = 0, count = 10, delta = 1): number[] {
  return Enumerable.range(i, count, delta).toArray();
}
