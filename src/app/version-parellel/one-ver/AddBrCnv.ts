import { IAddBase, DText, DOneLine } from '../../bible-text-convertor/AddBase';
import { deepCopy } from 'src/app/tools/deepCopy';
import { VerseRange } from 'src/app/bible-address/VerseRange';

export class AddBrCnv implements IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {
    for (const it1 of lines) {
      const re1: DText[] = [];
      // 這個是h3, 下一個不是時, 就加一個
      for (let i2 = 0; i2 < it1.children.length - 1; i2++) {
        const it2 = it1.children[i2];
        const itN = it1.children[i2 + 1];
        if (it2.isTitle1) {
          if (!itN.isTitle1) {
            const br = deepCopy(it2);
            br.isBr = 1;
            it1.children.splice(i2 + 1, 0, br); // insert
            i2++; // 略過下個(就是剛剛插入的)
          }
        }
      }
    }
    return lines;
  }

}
