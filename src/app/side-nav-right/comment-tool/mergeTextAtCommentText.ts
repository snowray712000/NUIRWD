import Enumerable from 'linq';
interface DTextWithSpaceAndItemInfo { idx?: number; w?: string; space?: number; tpIdx?: number; tp?: string; }
/**
 * 開發 注釋, 其中的 Add Order And List過程, 要合併文字時用
 */
export function mergeTextAtCommentText(datas: DTextWithSpaceAndItemInfo[], minSpace = 0) {
  makeSureIdxExist();
  // 反向, 找到需要合併的 w, 找到要合併到哪列 rrr2, 合併且移除掉合併與被合併中間的東西(應該是換行 isBr)

  // 原作法危險, 在 forEach 過程去 remove 這個 list, 會錯亂. 所以「記下idx」, 完成後再 remove 掉就好.
  const idxRemove: number[] = [];

  Enumerable.from(datas).where(a1 => a1.w !== undefined && a1.tpIdx === undefined
    && a1.space >= minSpace && a1.space !== 0)
    .reverse().forEach(a1 => {
      // tslint:disable-next-line: max-line-length
      const rrr2 = getBeMergedLine(a1);
      if (rrr2 !== undefined) {
        rrr2.w += a1.w.trim();
        idxRemove.push(...Enumerable.range(rrr2.idx + 1, a1.idx - rrr2.idx).toArray());
      }
    });

  const rr1 = Enumerable.from(idxRemove);
  datas = Enumerable.from(datas).where(a1 => rr1.contains(a1.idx) === false).toArray();

  // tslint:disable-next-line: no-string-literal
  Enumerable.from(datas).forEach(a1 => delete a1['idx']);
  return datas;
  function getBeMergedLine(aaa1: DTextWithSpaceAndItemInfo) {
    return Enumerable.from(datas).lastOrDefault(aa1 => aa1.w !== undefined && aa1.idx < aaa1.idx
      && aa1.tp !== '***' && aa1.tp !== '/**');
  }

  function makeSureIdxExist() {
    // tslint:disable-next-line: no-string-literal
    if (Enumerable.from(datas).any(a1 => a1['idx'] === undefined)) {
      // tslint:disable-next-line: no-string-literal
      Enumerable.from(datas).forEach((a1, i1) => a1['idx'] = i1);
    }
  }
}
