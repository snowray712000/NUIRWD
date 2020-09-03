import { DText } from 'src/app/bible-text-convertor/AddBase';
import * as LQ from 'linq';
import { assert } from 'src/app/tools/assert';
import { isArrayEqual } from 'src/app/tools/arrayEqual';
/** 這一層, 當遇到 ol 或 li, 它的 child 都不用畫, 在 html 中要用到 */
export function getIdxPass(datas?: DText[], indexs?: number[]): number[] {
  const re = [];
  while (true) {
    const r1 = getPair(re.length === 0 ? indexs[0] : re[re.length - 1]);
    if (r1.length === 0) {
      break;
    }
    re.push(...r1);
  }

  return re;
  function getPair(indexs0: number) {
    const rr1 = LQ.from(datas).skip(indexs0).indexOf(a1 => a1.isListStart === 1 || a1.isOrderStart === 1);
    if (rr1 !== -1) {
      const rr2 = rr1 + indexs0; // 那個 list start 或 order start 的地方.
      const rr3 = getcoresponse(rr2);
      assert(() => rr3 !== -1, '應該有總會有對應的.');

      // 2, 8 -> [3,4,5,6,7]
      const rre = LQ.range(rr2 + 1, rr3 - rr2 - 1).toArray();
      return rre;
    } else {
      return [];
    }
  }
  /** tp:0 表示 order start, tp:1 表示 list start */
  function getcoresponse(ii1: number) {
    const tp = datas[ii1].isOrderStart === 1 ? 0 : 1;
    let cnt = 0;
    const rrr1 = LQ.from(datas).skip(ii1 + 1).indexOf(aa1 => {
      if (tp === 0) {
        if (aa1.isOrderStart === 1) {
          cnt++;
        } else if (aa1.isOrderEnd === 1) {
          cnt--;
        }
      } else if (tp === 1) {
        if (aa1.isListStart === 1) {
          cnt++;
        } else if (aa1.isListEnd === 1) {
          cnt--;
        }
      }

      return cnt < 0;
    });
    if (rrr1 === -1) { return -1; }
    return rrr1 + ii1 + 1;
  }
  // 第0層, 應該要得 [3,4,5,6,7], 為何呢?
  // 首先是從0開始找, (因為indexs是[0~9]), 找到第1個 isOrderStart 或 isListStart 的index是 2
  // 找對應的就是 8 ... 那麼 [3,4,5,6,7] 就是內部 render 用的.
  // 注意[2]要包含在第0層, 才會 render <ol> 或 <li>
  // 第1層, 應該要得 [4,5,6], 為何呢?
  // 首先是從3開始找, 因為 indexs 會是 [3~7],
  // 找到第1個 isOrderStart 或 isListStart 的 index 是 3
  // 再找對應的就是 7 ...
  // 那麼 [4,5,6] 就是內部用的.
  // 第2層, 應該要得 [], 為何呢?
  // 首先, 從4開始找, 因為 indexs 會是 4,5,6
  // 找第1個 isOrderStart, 發現, 沒有 ... 那麼，就沒有下一層, 回傳 []
}


export function getIdxPassUnitTest() {
  unitTestGetIdxPass();
  unitTestGetIdxPass2();
  return;
  function unitTestGetIdxPass() {
    const datas: DText[] = [{ w: '123' }, { isBr: 1 },
    { isOrderStart: 1 }, { isListStart: 1 }, { w: 'abcd' }, { isBr: 1 }, { w: 'efgh' }, { isListEnd: 1 }, { isOrderEnd: 1 },
    { w: '456' }];
    assert(() => isArrayEqual(
      getIdxPass(datas, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      [3, 4, 5, 6, 7]));
    assert(() => isArrayEqual(
      getIdxPass(datas, [3, 4, 5, 6, 7]),
      [4, 5, 6]));
    assert(() => isArrayEqual(
      getIdxPass(datas, [4, 5, 6]),
      []));
  }
  function unitTestGetIdxPass2() {
    const datas: DText[] = [
      { w: '123' }, { isBr: 1 },
      { isOrderStart: 1 },
      { isListStart: 1 }, { w: 'abcd' }, { isListEnd: 1 },
      { isOrderEnd: 1 },
      { w: '456' },
      { isOrderStart: 1 },
      { isListStart: 1 }, { w: 'abcd' }, { isListEnd: 1 },
      { isOrderEnd: 1 },
      { w: '789' }
    ];
    assert(() => isArrayEqual(
      getIdxPass(datas, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
      [3, 4, 5, 9, 10, 11]));
  }
}

