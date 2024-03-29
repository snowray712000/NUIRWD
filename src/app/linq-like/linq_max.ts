import Enumerable from 'linq';
/** 若資料有 undefined 會有錯唷 */
export function linq_max<T>(users: T[], fnA?: (a: T) => number) {
  return Enumerable.from(users).select(a1 => fnA(a1)).max();
}

