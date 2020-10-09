export function linq_zip<T3, T1, T2>(src: T1[], src2: T2[], fn: (a1: T1, a2: T2) => {}): T3[] {
  const results = [];
  for (let i = 0; i < src.length && i < src2.length; i++) {
    results.push(fn(src[i], src2[i]));
  }
  return results;
}
