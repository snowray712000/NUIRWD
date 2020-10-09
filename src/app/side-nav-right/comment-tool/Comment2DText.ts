import { mergeTextAtCommentText } from 'src/app/side-nav-right/comment-tool/mergeTextAtCommentText';
import * as LQ from 'linq';
import { DText } from './../../bible-text-convertor/AddBase';
import { DAddress } from 'src/app/bible-address/DAddress';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { newLineNewLineSplit } from 'src/app/rwd-frameset/search-result-dialog/newLineNewLineSplit';
import { newLineNewLineMerge } from 'src/app/rwd-frameset/search-result-dialog/newLineNewLineMerge';
import { prepareDataForAddOrderAndListAtComment } from './prepareDataForAddOrderAndListAtComment';
import { addListStartAndEnd } from 'src/app/rwd-frameset/dtexts-rendor/addListStartAndEnd';
/**
 * 已包含 換行 處理
 * 非常困難, 花了整整一週開發.
 */
export class Comment2DText {
  main(text: string, addr: DAddress): DText[] {
    // console.clear();
    const r1 = new AddBrStdandard().main2([{ w: text }]);
    const r2 = this.addOrderList(r1);
    const r3 = addOrderIdx(r2);

    return r3;
    // 為了上色, 而加的
    function addOrderIdx(datas: DText[]) {
      let idxOrder = 1;
      for (const it1 of datas) {
        if (it1.isOrderStart === 1) {
          it1.idxOrder = idxOrder;
          idxOrder++;
        } else if (it1.isOrderEnd === 1) {
          idxOrder--;
        }
      }
      return datas;
    }
  }
  private addOrderList(data: DText[]) {
    // 連續2個換行的為一個 group <== 不這麼作, 注釋不適合 #羅1:16-17| 注釋
    const r1: { w?: string; space?: number; tpIdx?: number; }[] = data.map((a1, i1) => ({ idx: i1, ...getInfoEachLine(a1) }));
    const r2 = mergeText(r1);
    // console.log([...r2]);

    const r3 = prepareDataForAddOrderAndListAtComment(r2);
    // console.log([...r3]);
    const r4a = addListStartAndEnd(r3);
    // console.log(r4a);
    const r4 = r4a.map(a1 => a1.data);
    // console.log(r4);
    return r4;

    function mergeText(arg1: { idx?: number; w?: string; space?: number; tpIdx?: number; tp?: string; }[]) {
      const min = getMinSpaceItem();

      const rr1 = newLineNewLineSplit(arg1 as DText[]);
      const rr2 = rr1.map(a1 => doEachGroup(a1, min));
      const rr3 = newLineNewLineMerge(rr2) as { w?: string; space?: number; tpIdx?: number; }[];
      return rr3;

      // const rr2 = rr1.map(doEachGroup);
      // return newLineNewLineMerge(rr2);
      function doEachGroup(arg2: DText[], minSpace: number) {
        const arg3 = arg2 as { idx?: number; w?: string; space?: number; tpIdx?: number; tp?: string; }[];
        const re = mergeTextAtCommentText(arg3, minSpace);
        return re as DText[];
      }

      function getMinSpaceItem() {
        const rrr1 = LQ.from(arg1).where(a1 => a1.tpIdx !== undefined).select(a1 => a1.space);
        if (rrr1.isEmpty()) {
          return 0;
        }
        return rrr1.min();
      }


    }

    /** 空白數目, 項目類型, 項目文字 */
    function getInfoEachLine(a1: DText): any {
      if (a1.w == null || a1.w.length === 0) {
        return { ...a1 };
      }
      const rrr1 = getSpaceAndItem();
      return { ...a1, ...rrr1 };

      function getSpaceAndItem(): { space: number; tp?: string; tpIdx?: number; } {
        const tps = ['壹、', '一、', '（一）', '1.', '(1)', '●'];
        // tslint:disable-next-line: max-line-length
        const rr1 = /^(\s*)(?:([零壹貳參肆伍陸柒捌玖拾]+、)|([一二三四五六七八九十百]+、)|(（[零一二三四五六七八九十百]+）)|(\d+.)|(\(\d+\))|(「?[●◎⓪☆○※]|\/\*\*|\*\*\*))?/gi.exec(a1.w);
        if (rr1 == null) {
          console.warn('impossible');
        }

        const rrr2 = LQ.range(2, 6).firstOrDefault(aa1 => rr1[aa1] !== undefined);
        if (rrr2 == null) {
          return { space: rr1[1].length };
        }
        return { space: rr1[1].length, tp: rr1[rrr2], tpIdx: rrr2 - 2 };
      }
    }
  }
}
