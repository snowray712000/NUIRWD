import { BibleBookNames } from './BibleBookNames';
import { BookNameLang } from './BookNameLang';
import { range } from 'src/app/linq-like/Range';
/** if簡體 還沒處理 */
export class BookNameAndId {
  /** matt:40, mt:40, 太:40, lower case, 1-based */
  private static mapsNa2Id: Map<string, number>;
  /** */
  private static namesOrderByNameLength: string[];
  constructor() {
    if (BookNameAndId.mapsNa2Id === undefined) {
      this.generate();
    }
  }
  getIdOrUndefined(nameLowcase: string): number {
    return BookNameAndId.mapsNa2Id.get(nameLowcase);
  }
  // tslint:disable-next-line: max-line-length
  /** ["second thessalonians","first thessalonians",..."太"] */
  getNamesOrderByNameLength(): string[] {
    return BookNameAndId.namesOrderByNameLength;
  }
  private generate() {
    const rr1 = new Map<number, Array<string>>(); // Reg 1=['創世記','Matthew','Matt','太','Mt'] 2= ...
    range(1, 66).forEach(a1 => rr1.set(a1, []));
    const r2 = new Map<string, number>(); // 同時產生 創世記=1, matthew=1
    [BibleBookNames.getBookNames(BookNameLang.馬太福音),
    BibleBookNames.getBookNames(BookNameLang.Matthew),
    BibleBookNames.getBookNames(BookNameLang.Matt),
    BibleBookNames.getBookNames(BookNameLang.太),
    BibleBookNames.getBookNames(BookNameLang.Mt)].forEach(a2 => a2.forEach((a1, i) => {
      rr1.get(i + 1).push(a1);
      r2.set(a1.toLowerCase(), i + 1);
    }));
    // 特殊中文字 / 別名
    const sp1 = [
      { id: 62, na: ['約壹', '約翰壹書'] },
      { id: 63, na: ['約貳', '約翰貳書'] },
      { id: 64, na: ['約參', '約翰參書'] },
    ];
    sp1.forEach(a1 => {
      a1.na.forEach(a2 => {
        rr1.get(a1.id).push(a2);
        r2.set(a2.toLowerCase(), a1.id);
      });
    });
    // 結果1
    BookNameAndId.mapsNa2Id = r2;
    BookNameAndId.namesOrderByNameLength = Array.from(r2.keys()).sort((a1, a2) => a2.length - a1.length);
    // mt 若剛好有個也是 mt 開頭會被誤會,所以長的在前面

    // console.log(BookNameAndId.mapsNa2Id);
    // console.log(BookNameAndId.namesOrderByNameLength);
  }
}
