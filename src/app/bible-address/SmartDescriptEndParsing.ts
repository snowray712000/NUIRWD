import { SplitStringByRegexVer2 } from '../tools/SplitStringByRegex';
import { getVerseCount } from '../const/count-of-verse';
export class SmartDescriptEndParsing {
  /** 不需要變更, 會回傳 undefined, 否則, 回傳 1:2-e 回傳 1:2-34 */
  main(book: number, des: string): string {
    // 1:end or 1:e
    // 1:2-2:end or 1:2-2:e
    // 1:3-end or 1:3-e
    const r1 = new SplitStringByRegexVer2().main(des, /(?:((\d+):)e|end)|(?:((\d+):(?:\d+)-)e|end)/gi);
    // console.log(r1);
    if (r1.length === 1 && r1[0].exec === null) {
      return undefined;
    }
    let re3 = '';
    for (const it2 of r1) {
      if (it2.exec === undefined) {
        re3 = re3 + it2.w;
      }
      else {
        if (it2.exec[1] === undefined) {
          // [3] '1:4-' [4] '1'
          const vr = getVerseCount(book, parseInt(it2.exec[4], 10));
          re3 = re3 + it2.exec[3] + vr.toString();
        }
        else {
          // [1] '1:' [2] '1'
          const vr = getVerseCount(book, parseInt(it2.exec[2], 10));
          re3 = re3 + it2.exec[1] + vr.toString();
        }
      }
    }
    // console.log(re3);
    return re3;
  }
}
