export function range(i= 0, count = 10, delta = 1): number[] {
  const re = new Array<number>();
  let r1 = 0;
  let r2 = i;
  while (r1 < count) {
    re.push(r2);
    if (r1 === count) {
      break;
    }
    r2 += delta;
    r1++;
  }
  return re;
}
