/** 若資料有 undefined 會有錯唷 */
export function linq_max<T>(users: T[], fnA?: (a: T) => number) {
  if (fnA === undefined) {
    return Math.max(...(users as unknown[] as number[]));
  } else {
    return users.reduce((oa, u) => Math.max(oa, fnA(u)), 0);
  }
}

