import { IAddBase, DOneLine, DText } from '../../bible-text-convertor/AddBase';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
import { PACKAGE_ROOT_URL } from '@angular/core';
/** unv用, ncv 新譯本也用, 全型小括號 */
export class AddParenthesesUnvNcv implements IAddBase {
  /** 若都沒有, 就回傳 lines, 不然, 會回傳新的一份 */
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;
    for (const it1 of lines) {
      const re1 = this.doOneLine(it1);
      if (isExistChange === false && re1 !== it1.children) {
        isExistChange = true;
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }
    return isExistChange ? re : lines;
  }
  /** 
   * 如果 return 值 === input, 表示沒有變更
   * 開發給 async 用的
   */
  mainDoOne(one: DOneLine): DOneLine {
    const r1 = this.doOneLine(one);
    if (r1 === one.children) {
      return one;
    } else {
      return { addresses: one.addresses, children: r1 };
    }
  }
  /** 若沒有，即 split string by regex 是 length = 1, 會回傳原值 children */
  private doOneLine(it1: DOneLine): DText[] {
    const pthis = this;
    let isExistChange = false;
    const re1: DText[] = [];
    for (const it2 of it1.children) {
      // const r1 = new SplitStringByRegexVer2().main(it2.w, /（[^）]+）/g);
      // const r1 = new SplitStringByRegexVer2().main(it2.w, /（[^（]*（[^）]*）[^）]*）|（[^）]+）/g);
      // const r1 = new SplitStringByRegexVer2().main(it2.w, /(?:(（[^（]*)(（[^）]*）)([^）]*）))|(?:（[^）]+）)/g);
      const r1 = new SplitStringByRegexVer2().main(it2.w, /(?:(（[^（]*)(（[^）]*）)([^）]*）))|(?:（([^）]+)）)|(?:\(([^\)]+)\))/g);
      if (r1.length === 1) {
        re1.push(it2);
        continue;
      }

      // console.log(r1);
      for (const it3 of r1) {
        const r2 = deepCopy(it2);
        const tp = getTypeOfParentheses(it3.exec);
        if (isExistChange === false && tp !== ParenthesesType.none) {
          isExistChange = true;
        }

        switch (tp) {
          case ParenthesesType.none:
            r2.w = it3.w;
            re1.push(r2);
            break;
          case ParenthesesType.Two:
            // 兩層括號的 (會丟3個)
            this.doWhenHave2Parentheses(r2, it3, re1);
            break;
          case ParenthesesType.Full:
            // 全型
            r2.w = it3.exec[0];
            r2.isParenthesesFW = 1;
            re1.push(r2);
            break;
          case ParenthesesType.Half:
            // 半型括號
            r2.w = it3.exec[0];
            r2.isParenthesesHW = 1;
            re1.push(r2);
          default:
            break;
        }
      }
    }
    if (isExistChange === false) {
      return it1.children;
    }
    return re1;

    function getTypeOfParentheses(exec: RegExpExecArray): ParenthesesType {
      if (exec === undefined) return ParenthesesType.none;
      if (exec[1] !== undefined) return ParenthesesType.Two;
      if (exec[4] !== undefined) return ParenthesesType.Full;
      return ParenthesesType.Half;
    }
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

enum ParenthesesType {
  'none',
  /** 半型小括號 */
  'Half',
  /** 全型小括號 */
  'Full',
  /** 兩層，通常是全型 */
  'Two',
}