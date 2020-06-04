import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DOneLine, IAddBase } from './AddBase';
import { linq_last, firstOrDefault } from 'src/app/linq-like/FirstOrDefault';
import { getNextAddress, isTheSameAddress } from 'src/app/bible-address/DAddress';
/** 'a' 和合本 併入上節 Ps8:6-9 或 Ps8:6-9.60:1-2.92:1-4.Ps8:8 */
export class AddMergeVerse implements IAddBase {
  /** 若有合併, 回傳新的一份, 若沒有, 即回傳 lines */
  async mainAsync(lines: DOneLine[], verses: VerseRange): Promise<DOneLine[]> {
    const re: DOneLine[] = [];
    let isExistMerge = false;
    for (let i1 = 0; i1 < lines.length; i1++) {
      const it1 = lines[i1];
      const isMerge = it1.children.length === 1 && it1.children[0].w === 'a';
      if (false === isMerge) {
        re.push(it1);
        continue;
      }
      const fnChangeMerge = () => {
        it1.children[0].w = '〖併入上節〗';
        it1.children[0].isMerge = 1;
        re.push(it1);
        isExistMerge = true;
      };
      if (i1 === 0) {
        fnChangeMerge();
        continue;
      }
      const isContinueVerse = this.isContinueVerse(lines[i1 - 1], it1);
      if (false === isContinueVerse) {
        fnChangeMerge();
        continue;
      }
      const fnMergeWithPreVerse = () => {
        lines[i1 - 1].addresses.addRange(it1.addresses.verses);
        lines.splice(i1, 1);
        i1--;
        isExistMerge = true;
      };
      fnMergeWithPreVerse();
      continue;
    }
    return isExistMerge ? re : lines;
  }
  private isContinueVerse(lineA: DOneLine, lineB: DOneLine) {
    if (lineA === undefined || lineB === undefined) {
      return false;
    }
    const v1 = linq_last(lineA.addresses.verses);
    const v2 = firstOrDefault(lineB.addresses.verses);
    if (v1.book !== v2.book) {
      return false;
    }
    return isTheSameAddress(getNextAddress(v1), v2);
  }
}
