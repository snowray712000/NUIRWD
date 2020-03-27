export class ObjTools {
  /**
   * 一直呼叫 Object.keys(obj).some(a1 => a1 === key) 很累.
   * @param obj 物件
   * @param key 的key通常是 string, 函式會自動轉
   */
  public static isExistKeys(obj, key: number | string) {
    if (typeof key === 'number') {
      key = key.toString();
    }
    return Object.keys(obj).some(a1 => a1 === key);
  }
}
