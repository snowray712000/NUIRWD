import { DText } from 'src/app/bible-text-convertor/AddBase';
import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import * as LQ from 'linq';
import { AddReferenceFromOrigDictCBOLChineseText } from "src/app/version-parellel/one-ver/AddReferenceFromOrigDictCBOLChineseText";
import { deepCopy } from 'src/app/tools/deepCopy';
/** 將 cvtNewChinese cvtNewEng cvtOldChinese cvtOldEng 整理, 因為它們 code 很多相同的地方 */


export class CBOL2DTextConvertor {
  private regChineseOld = /(?:SN)?(G)?(\d+[a-z]?)/gi;
  private regChineseNew = /(?:SN)?(H)?(\d+[a-z]?)/gi;
  private regEngNew = /\d+[a-z]?/gi;
  private regEngOld = /\d+[a-z]?/gi;
  private isOld: number; // main 時會更新
  private isChinese: number; // main 時會更新

  main(arg: { str: string; isOld?: 0 | 1; isChinese?: 0 | 1; }): DText[] {
    this.isOld = arg.isOld;
    this.isChinese = arg.isChinese;
    // 先 copy 最原版, 新約中文
    let r3: DText[] = [{ w: arg.str }];
    r3 = new AddBrStdandard().main2(r3);
    if (this.isFitNormalCase(r3)) {
      r3 = this.addSnNormalCaseCore(r3);
    }
    else {
      console.warn(r3);
    }
    if (arg.isChinese) {
      r3 = new AddReferenceFromOrigDictCBOLChineseText().main2(r3);
    }
    return r3;
  }
  /** 原本 for CBOL New Chinese, 但 Eng 也用, 所以抽出來 */
  private isFitNormalCase(r1: DText[]) {
    return r1.length > 4 && !r1[0].isBr && !r1[3].isBr && r1[1].isBr === 1 && r1[2].isBr === 1;
  }
  private addSnNormalCaseCore(r3: DText[]) {
    const pthis = this;

    const reg = getReg();
    const r4 = new SplitStringByRegexVer2().main(r3[3].w, /;/gi);
    const r5 = new SplitStringByRegexVer2().main(r4[0].w, reg);
    if (r5.length > 1) {
      const re2 = LQ.from(r4).skip(1).select(a1 => a1.w).toArray().join('');
      const re2b = deepCopy(r3[3]);
      re2b.w = re2;

      const fnCvt = getFnCvtor();
      const re1 = r5.map(a1 => fnCvt(a1, r3[3])); // 原本的r3[3] 前半部, re2b 就是後半部
      const re3 = re1.concat(re2b);

      // 將 r3[3] 以 re3 取代
      const r6 = LQ.from(r3);
      const re4 = r6.take(3).concat(LQ.from(re3)).concat(r6.skip(4)).toArray();
      return re4;
    }
    return r3; // 沒改變

    function getReg() {
      if (pthis.isChinese) {
        if (!pthis.isOld) {
          return pthis.regChineseNew;
        }
        else {
          return pthis.regChineseOld;
        }
      }
      else {
        if (!pthis.isOld) {
          return pthis.regEngNew;
        }
        else {
          return pthis.regEngOld;
        }
      }
    }
    function getFnCvtor() {
      if (pthis.isChinese) {
        if (!pthis.isOld) {
          return cvtNewChinese;
        }
        else {
          return cvtOldChinese;
        }
      }
      else {
        if (!pthis.isOld) {
          return cvtNewEng;
        }
        else {
          return cvtOldEng;
        }
      }

    }

    type RegResult = { w: string; exec?: RegExpExecArray; };
    function cvtNewChinese(a1: RegResult, refDTextForCopy: DText): DText {
      const re1 = deepCopy(refDTextForCopy);
      if (a1.exec === undefined) {
        re1.w = a1.w;
        return re1;
      }
      else {
        const GorH = a1.exec[1] === undefined ? 'G' : 'H';
        re1.w = GorH + a1.exec[2]; // H0321
        re1.sn = a1.exec[2];
        re1.tp = GorH;
        return re1;
      }
    }
    function cvtOldChinese(a1: RegResult, refDTextForCopy: DText): DText {
      const re1 = deepCopy(refDTextForCopy);
      if (a1.exec === undefined) {
        re1.w = a1.w;
        return re1;
      }
      else {
        const GorH = a1.exec[1] === undefined ? 'H' : 'G';
        re1.w = GorH + a1.exec[2]; // H0321
        re1.sn = a1.exec[2];
        re1.tp = GorH;
        return re1;
      }
    }
    function cvtOldEng(a1: RegResult, refDTextForCopy: DText): DText {
      const re1 = deepCopy(refDTextForCopy);
      if (a1.exec === undefined) {
        re1.w = a1.w;
        return re1;
      }
      else {
        const GorH = 'H';
        re1.w = GorH + a1.exec[0]; // H0321a
        re1.sn = a1.exec[0];
        re1.tp = GorH;
        return re1;
      }
    }
    function cvtNewEng(a1: RegResult, refDTextForCopy: DText): DText {
      const re1 = deepCopy(refDTextForCopy);
      if (a1.exec === undefined) {
        re1.w = a1.w;
        return re1;
      }
      else {
        const GorH = /Hebrew origin|Aramaic origin/i.test(r4[0].w) ? 'H' : 'G';
        re1.w = GorH + a1.exec[0]; // H0321a
        re1.sn = a1.exec[0];
        re1.tp = GorH;
        return re1;
      }
    }
  }
}
