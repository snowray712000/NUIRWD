import { DOneLine } from "../../bible-text-convertor/DOneLine";
import { DText } from "../../bible-text-convertor/DText";
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { BookNameGetter } from 'src/app/const/book-name/BookNameGetter';
import { deepCopy } from 'src/app/tools/deepCopy';
import Enumerable from 'linq';
import { BookNameConstants } from 'src/app/const/book-name/BookNameConstants';
/**
 * 當 原文字典查到時, 或是註釋, 應該都會需要這個
 * 這次作法更好, 先Parsing 各個, 再嘗試結合 這樣邏輯更清楚
 * 例如 太1:2;路1:3 就會變成2個, 若連續, 再合併
 */
export class AddReferenceFromOrigDictText {
  main(lines: DOneLine[], verses?: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const reg1 = this.generateRegex();
        const r3 = new SplitStringByRegexVer2().main(it2.w, reg1);
        for (const it3 of r3) {
          if (it3.exec === undefined) {
            const r2 = deepCopy(it2);
            r2.w = it3.w;
            re1.push(r2);
          } else {
            const last = Enumerable.from(re1).lastOrDefault();
            // var last = FHL.linq_last(re2);
            if (last !== undefined && last.isRef === 1) {
              last.w += it3.exec[0];
              last.refDescription += it3.exec[1] + it3.exec[2];
            } else {
              const r2 = deepCopy(it2);
              r2.w = it3.exec[0];
              r2.isRef = 1;
              r2.refDescription = it3.exec[1] + it3.exec[2];
              re1.push(r2); // ref: reference
              isExistChange = true;
            }
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
    // #太1 一定是
    // 太1 略#號
    // #2: or #2; 可能是(略卷名) ... #2:1-3:1 #2:1 #2;
    // 3: 可能是 ... 3:1

    const books = BookNameGetter.getAllOrderByLengthDesc();

    const r1a = '(?:' + books.join('|') + ')[ 　]*\\d+';
    const r2a = '\\d+[:; 　]';
    const ra = '#?(' + r1a + '|' + r2a + ')' // '(?:r1a|r2a)'

    const r3b = '([\\-,;:\\d ；：　]+)\\|?';
    const re = new RegExp(ra + r3b, 'gi');
    return re;
  }
}

