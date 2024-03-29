import { IAddBase } from '../../bible-text-convertor/AddBase';
import { DOneLine } from "../../bible-text-convertor/DOneLine";
import { DText } from "../../bible-text-convertor/DText";
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { deepCopy } from 'src/app/tools/deepCopy';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';

/** 
 * 使用 \r\n 或 \n 來換行的 
 * 若沒有任何改變，則回傳原本的，反之，回傳一整份新的
 * 當時寫的時候，還沒有 DText 存在 children 的考慮
 **/
export class AddBrStdandard implements IAddBase {
  main(lines: DOneLine[], verses?: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r3 = new SplitStringByRegexVer2().main(it2.w, /\r?\n/ig);
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            delete r2.w; // r2.w = '';
            r2.isBr = 1;
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
}
