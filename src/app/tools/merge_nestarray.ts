/** 常常有資料透過 linq select 形成 [][], 要合併就要再寫幾行, 因此開發這個 */
export function merge_nestarray<T>(datas: T[][]): T[] {
  const re: T[] = [];
  for (const it1 of datas) {
    for (const it2 of it1) {
      re.push(it2);
    }
  }
  return re;
}
