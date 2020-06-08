import { IAddBase, DOneLine, DText } from './AddBase';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
/** unv用, ncv 新譯本也用, 全型小括號 */
export class AddParenthesesUnvNcv implements IAddBase {
  /** 若都沒有, 就回傳 lines, 不然, 會回傳新的一份 */
  async mainAsync(lines: DOneLine[], verses: VerseRange): Promise<DOneLine[]> {
    const re: DOneLine[] = [];
    let isExistChange = false;
    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        // const r1 = new SplitStringByRegexVer2().main(it2.w, /（[^）]+）/g);
        // const r1 = new SplitStringByRegexVer2().main(it2.w, /（[^（]*（[^）]*）[^）]*）|（[^）]+）/g);
        // const r1 = new SplitStringByRegexVer2().main(it2.w, /(?:(（[^（]*)(（[^）]*）)([^）]*）))|(?:（[^）]+）)/g);
        const r1 = new SplitStringByRegexVer2().main(it2.w, /(?:(（[^（]*)(（[^）]*）)([^）]*）))|(?:（([^）]+)）)|(?:\(([^\)]+)\))/g);
        console.log(r1);
        for (const it3 of r1) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            if (it3.exec[1] !== undefined) {
              // 兩層括號的 (會丟3個)
              this.doWhenHave2Parentheses(r2, it3, re1);
            } else {
              // 一層括號的
              if (it3.exec[4] !== undefined) {
                // 全型
                r2.w = it3.exec[0];
                r2.isParenthesesFW = 1;
                re1.push(r2);
              } else if (it3.exec[5] !== undefined) {
                // 半型括號
                r2.w = it3.exec[0];
                r2.isParenthesesHW = 1;
                re1.push(r2);
              }
            }
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }
    return isExistChange ? re : lines;
  }

  private doWhenHave2Parentheses(r2: DText, it3: {
    w: string; // 兩層括號的
    // 兩層括號的
    exec?: RegExpExecArray;
  }, re1: DText[]) {
    r2.w = it3.exec[1];
    r2.isParenthesesFW = 1;
    re1.push(r2);
    let r3 = deepCopy(r2);
    r3.w = it3.exec[2];
    r3.isParenthesesFW2 = 1;
    re1.push(r3);
    r3 = deepCopy(r2);
    r3.w = it3.exec[3];
    re1.push(r3);
  }
}
