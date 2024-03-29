import { TextWithSnConvertor } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { IAddBase } from '../../bible-text-convertor/AddBase';
import { DOneLine } from "../../bible-text-convertor/DOneLine";
import { DText } from "../../bible-text-convertor/DText";
import { deepCopy } from 'src/app/tools/deepCopy';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { VerseRange } from 'src/app/bible-address/VerseRange';
/** WG WTG WAG WTH WH */
export class AddSnInfo implements IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;
    for (const it1 of lines) {
      const re1 = this.doOne(it1);            
      if (isExistChange === false && re1 !== it1.children) {
        isExistChange = true;
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }    
    return isExistChange ? re : lines;
  }
  /** 如果 return === input 表示沒變更。 這是為了 async 拆出來的 */
  mainOne(one: DOneLine): DOneLine {
    const re = this.doOne(one);  
    if (re === one.children) return one;
    return { addresses: one.addresses, children: re };
  }
  /** 如果 return 與 it1.children 一樣，表示沒變 */
  private doOne(it1: DOneLine): DText[] {
    let isExistChange = false;

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
    if (isExistChange) return re1;
    return it1.children;
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


