import { IAddBase, DOneLine, DText } from './AddBase';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
export class AddParenthesesUnv implements IAddBase {
  /** 若都沒有, 就回傳 lines, 不然, 會回傳新的一份 */
  async mainAsync(lines: DOneLine[], verses: VerseRange): Promise<DOneLine[]> {
    const re: DOneLine[] = [];
    let isExistChange = false;
    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r1 = new SplitStringByRegexVer2().main(it2.w, /（[^）]+）/g);
        // console.log(r1);
        for (const it3 of r1) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            r2.w = it3.exec[0];
            r2.isParentheses = 1;
            re1.push(r2);
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }
    return isExistChange ? re : lines;
  }
}
