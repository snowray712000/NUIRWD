import { DOneLine, DText } from '../../bible-text-convertor/AddBase';
import { deepCopy } from 'src/app/tools/deepCopy';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { VerseRange } from 'src/app/bible-address/VerseRange';
/** H521a G421a 用於原文字典結果浸宣版 */

export class AddSnForOrigDictTwcbNew {
  main(lines: DOneLine[], verses?: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r3 = new SplitStringByRegexVer2().main(it2.w, this.generateRegex());
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          }
          else {
            r2.w = it3.exec[0];
            r2.tp = it3.exec[1] as 'H' | 'G';
            r2.sn = it3.exec[2];
            re1.push(r2);
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }

    return isExistChange ? re : lines;
  }
  /** OrigDict 使用, 核心也是用 main() */
  main2(lines: DText[]): DText[] {
    const r1: DOneLine = {
      children: lines
    };
    const r2 = this.main([r1]);
    return r2[0].children;
  }
  private generateRegex() {
    return /(H|G)(\d+[a-z]?)/gi;
  }
}
/** 521a 421a 用於原文字典結果浸宣版 */
export class AddSnForOrigDictCbolChinese {
  main(lines: DOneLine[], verses?: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r3 = new SplitStringByRegexVer2().main(it2.w, this.generateRegex());
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            r2.w = it3.exec[0];
            r2.tp = it3.exec[1] as 'H' | 'G';
            r2.sn = it3.exec[2];
            re1.push(r2);
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }

    return isExistChange ? re : lines;
  }
  /** OrigDict 使用, 核心也是用 main() */
  main2(lines: DText[]): DText[] {
    const r1: DOneLine = {
      children: lines
    };
    const r2 = this.main([r1]);
    return r2[0].children;
  }
  private generateRegex() {

    return /^[ 　\t]?(\d+[a-z]?)^[ 　\t\r\n]/gi; // 一定要有空白隔開, 但若在字首又不一定要有
  }
}
