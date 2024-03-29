import { IAddBase } from '../../bible-text-convertor/AddBase';
import { DOneLine } from "../../bible-text-convertor/DOneLine";
import { DText } from "../../bible-text-convertor/DText";
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
export class AddTitleH3 implements IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        const r3 = new SplitStringByRegexVer2().main(it2.w, /<h3>([^<]+)<\/h3>/ig);
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            r2.w = it3.exec[1];
            r2.isTitle1 = 1 ;
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
