import { DText } from './../../../bible-text-convertor/AddBase';
import * as LQ from 'linq';

export function addListStartAndEnd(datas: DListAdd[]): DListAdd[] {
  const isDebug = false;
  const r1 = getMaxLevel();
  LQ.range(0, r1).forEach(doLevel);
  return datas;
  /** 若得到 1，只要分析第0層。 */
  function getMaxLevel() {
    return LQ.from(datas).select(a1 => a1.list === undefined ? -1 : a1.list.length).max();
  }
  function doLevel(level: number) {
    if (isDebug) { console.log('dolevel ' + level); }
    const orders = getOrders();
    if (isDebug) { console.log('get orders ' + JSON.stringify(orders)); }
    LQ.from(orders).reverse().forEach(doOrder);
    if (isDebug) { console.log('after do level, datas ' + JSON.stringify(datas)); }
    return;
    function getOrders() {
      const rr1 = getStarts();
      const rr2 = rr1.map(a1 => ([a1, getEnd(a1)]));
      return rr2;
      function getLevels() {
        return LQ.from(datas).select(a1 => a1.list === undefined ? 0 : a1.list.length).toArray();
      }
      function getStarts() {
        const r1Levels = getLevels();
        const reOrderStarts = LQ.range(0, r1Levels.length).where(a1 => {
          if (a1 !== 0) {
            if (r1Levels[a1 - 1] === level && r1Levels[a1] === level + 1) {
              return true;
            }
          }
          if (level === 0 && a1 === 0 && r1Levels[0] === 1) {
            return true;
          }
          return false;
        }).toArray();
        return reOrderStarts;
      }
      function getEnd(idxS: number) {
        const r1Levels = getLevels();
        const rrr2 = LQ.from(r1Levels).skip(idxS).indexOf(a1 => a1 <= level);
        if (rrr2 === -1) { return datas.length - 1; } // 0based, 所以 -1
        return rrr2 - 1 + idxS; // -1: 上一個, + idxS: 因為當時skip掉
      }
    }
    function doOrder(order: [number, number]) {
      if (isDebug) { console.log('do Order ' + JSON.stringify(order)); }
      const lists = getLists();
      if (isDebug) { console.log('get lists ' + JSON.stringify(lists)); }

      // do this order
      datas.splice(order[1] + 1, 0, { data: { isOrderEnd: 1 } });
      datas.splice(order[0], 0, { data: { isOrderStart: 1 } });
      lists.forEach(a1 => { a1[0] += 1; a1[1] += 1; });

      // do each list reverse
      LQ.from(lists).reverse().forEach(doList);
      return;
      function getLists() {
        // {idx:0,item:1} 表示在 data 中 index 是0, item是指 [1]
        // {idx:1,item:1}
        // {idx:2,item:1}
        // {idx:3,item:2}
        // 以上例子, 就會得到 list 0,2 與 3,3
        const rrr1 = LQ.from(datas).skip(order[0]).take(order[1] - order[0] + 1)
          .select((a1, i1) => ({ idx: i1 + order[0], item: a1.list[level] }))
          .toArray();

        // 直覺雖然是用 groupBy, 但若下 case 則不行
        // {idx:0,item:1}
        // {idx:1,item:1}
        // {idx:2,item:2}
        // {idx:3,item:1}
        // {idx:4,item:1}
        // 用 item 剛變 (或最後一個) 時丟進
        // {idx:0,item:1}
        // {idx:1,item:1}
        // {idx:2,item:2}
        // {idx:3,item:1}
        // {idx:4,item:1}
        // {idx:-1,item:-1} // 額外加的, 這樣使下面簡易
        const rrrre = [];
        let lastIdx = 0;
        LQ.from(rrr1).concat([{ idx: -1, item: -1 }]).forEach((a1, i1) => {
          if (i1 === 0) {
            lastIdx = a1.idx;
            return;
          }
          if (a1.item !== rrr1[i1 - 1].item) {
            rrrre.push([lastIdx, rrr1[i1 - 1].idx]);
            lastIdx = a1.idx;
          }
        });
        return rrrre;
      }
      function doList(list: [number, number]) {
        datas.splice(list[1] + 1, 0, { data: { isListEnd: 1 } });
        datas.splice(list[0], 0, { data: { isListStart: 1 } });
      }
    }
  }
}
export interface DListAdd { list?: number[]; data: DText; }


