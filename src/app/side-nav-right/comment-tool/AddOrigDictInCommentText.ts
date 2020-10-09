import { deepCopy } from 'src/app/tools/deepCopy';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { DText } from './../../bible-text-convertor/AddBase';

export class AddOrigDictInCommentText {
  main(datas: DText[]) {
    // SNH02219 /#/bible/箴20:20-28
    const re1: DText[] = [];
    for (const it1 of datas) {
      if (isImpossibleOrig(it1)) {
        re1.push(it1);
        continue;
      }
      const r1 = new SplitStringByRegexVer2().main(it1.w, /(?:SN)?(H|G)(\d+[a-z]?)/gi);
      if (r1.length === 1) {
        re1.push(it1);
      }
      else {
        for (const it2 of r1) {
          const r2 = deepCopy(it1);
          r2.w = it2.w;
          if (it2.exec === undefined) {
            re1.push(r2);
          }
          else {
            const HorG = /H/i.test(it2.exec[1]) ? 'H' : 'G';
            const sn = it2.exec[2];
            r2.tp = HorG;
            r2.sn = sn;
            re1.push(r2);
          }
        }
      }
    }

    return re1;
    function isImpossibleOrig(a1: DText) {
      return a1.w === undefined || a1.w.length === 0 ||
        a1.isOrderEnd === 1 || a1.isOrderStart === 1 || a1.isListStart === 1 || a1.isListEnd === 1
        || a1.isBr === 1 || a1.isHr === 1 || a1.isRef === 1;
    }
  }
}
