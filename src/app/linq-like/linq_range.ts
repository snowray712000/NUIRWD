import * as LQ from 'linq';
export function linq_range(i = 0, count = 10, delta = 1): number[] {
  return LQ.range(i, count, delta).toArray();
}
