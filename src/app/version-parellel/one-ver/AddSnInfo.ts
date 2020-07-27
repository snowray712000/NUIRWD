import { TextWithSnConvertor } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { DOneLine, DText, IAddBase } from './AddBase';
import { deepCopy } from 'src/app/tools/deepCopy';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { VerseRange } from 'src/app/bible-address/VerseRange';
/** WG WTG WAG WTH WH */
export class AddSnInfo implements IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {

    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r3 = new SplitStringByRegexVer2().main(it2.w, /{<(W(T?)A?(G|H))(\d+[a-z]?)>}|<(W(T?)A?(G|H))(\d+[a-z]?)>/ig);
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            re1.push(this.doSn(it3.exec, r2));
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }
    // console.log(re);

    return isExistChange ? re : lines;
    // return lines.map(a1 => this.cvt(a1));
  }
  /** re2 是 in out, 因為要保持原來的其它不變的屬性 */
  private doSn(exec: RegExpExecArray, inOutRe2: DText) {
    const r1 = exec;
    const isCurly = r1[1] !== undefined ? 1 : 0;
    const idxOffset = isCurly === 1 ? 0 : 4;
    const sn = r1[4 + idxOffset];
    const tp = r1[3 + idxOffset] as ('H' | 'G');
    const tp2 = r1[1 + idxOffset] as ('WG' | 'WTG' | 'WAG' | 'WTH' | 'WH');
    const w2 = r1[2 + idxOffset] === 'T' ? `(${tp}${sn})` : `<${tp}${sn}>`;
    const w = isCurly === 1 ? `{${w2}}` : w2;

    inOutRe2.w = w;
    inOutRe2.sn = sn;
    inOutRe2.tp = tp;
    inOutRe2.tp2 = tp2;
    inOutRe2.isCurly = isCurly;
    return inOutRe2;
  }
}


