import * as LQ from 'linq';
/** 參考 deepCopy。key數量並值一樣。 */

export function isDeepEqual<T>(a: T, b: T): boolean {
  if (isTheSameKeyLengthThisLevel() === false) {
    return false;
  }

  for (const key in a) {
    if (a.hasOwnProperty(key) && a[key] !== undefined) {
      const ra = a[key];
      const rb = b[key];
      if (isTheSameType(ra, rb) === false) {
        return false;
      }

      if (Array.isArray(ra)) {
        if (LQ.from(ra as any[]).all(a1 => isDeepEqual(ra, rb)) === false) {
          return false;
        }
      } else if (typeof ra === 'object') {
        if (false === isDeepEqual(ra, rb)) {
          return false;
        }
      } else {
        if (ra !== rb) {
          return false;
        }
      }
    }
  }
  return true;

  // {a:undefined} 與 {} 視為一樣
  function isTheSameKeyLengthThisLevel() {
    let cnt1 = 0;
    // tslint:disable-next-line: forin
    for (const key in a) {
      if (a.hasOwnProperty(key) && a[key] !== undefined) {
        cnt1++;
      }
    }
    let cnt2 = 0;
    // tslint:disable-next-line: forin
    for (const key in b) {
      if (a.hasOwnProperty(key) && b[key] !== undefined) {
        cnt2++;
      }
    }
    return cnt1 === cnt2;
  }
  function isTheSameType(r1, r2) {
    return (Array.isArray(r1) && Array.isArray(r2))
      || typeof r1 === typeof r2;

  }
}
