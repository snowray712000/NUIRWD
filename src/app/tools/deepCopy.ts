/** 用 for in 與 recursive 組成的 */
export function deepCopy<T>(a: T): T {
  // https://stackoverflow.com/questions/28150967/typescript-cloning-object
  const re: any = {};
  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      const element = a[key];
      if (typeof element === 'object') {
        re[key] = deepCopy(element);
      } else {
        re[key] = element;
      }
    }
  }
  return re as T;
}
