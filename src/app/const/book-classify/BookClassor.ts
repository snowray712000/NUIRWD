import * as LQ from 'linq';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { BookNameConstants } from '../book-name/BookNameConstants';
export interface DOneBookClassor {
  name: string;
  books: number[];
}

export class BookClassor {  
  private static allTypes: DOneBookClassor[] = [];
  private static allTypesGB: DOneBookClassor[] = [];

  constructor() {
    if (BookClassor.allTypes.length === 0) {
      const alls: DOneBookClassor[] = [];
      alls.push(({ name: '全部', books: LQ.range(1, 66).toArray() }));
      alls.push(({ name: '舊約', books: LQ.range(1, 39).toArray() }));
      alls.push(({ name: '新約', books: LQ.range(40, 27).toArray() }));
      alls.push(({ name: '摩西五經', books: LQ.range(1, 5).toArray() }));
      alls.push(({ name: '歷史書', books: LQ.range(6, 12).toArray() }));
      alls.push(({ name: '詩歌智慧書', books: LQ.range(18, 5).toArray() }));
      alls.push(({ name: '大先知書', books: LQ.range(23, 5).toArray() }));
      alls.push(({ name: '小先知書', books: LQ.range(28, 12).toArray() }));
      alls.push(({ name: '福音書', books: LQ.range(40, 5).toArray() })); // 使徒行傳加到福音書(畢竟是路加寫的下集)
      alls.push(({ name: '保羅書信', books: LQ.range(45, 13).toArray() }));
      alls.push(({ name: '其它書信', books: LQ.range(58, 9).toArray() })); // 希伯來書加在這56
      BookClassor.allTypes = alls;      
    }
    generateGB();
    return;
    function generateGB(){
      if (BookClassor.allTypesGB.length === 0) {
        const alls: DOneBookClassor[] = [];
        alls.push(({ name: '全部', books: LQ.range(1, 66).toArray() }));
        alls.push(({ name: '旧约', books: LQ.range(1, 39).toArray() }));
        alls.push(({ name: '新约', books: LQ.range(40, 27).toArray() }));
        alls.push(({ name: '摩西五经', books: LQ.range(1, 5).toArray() }));
        alls.push(({ name: '历史书', books: LQ.range(6, 12).toArray() }));
        alls.push(({ name: '诗歌智慧书', books: LQ.range(18, 5).toArray() }));
        alls.push(({ name: '大先知书', books: LQ.range(23, 5).toArray() }));
        alls.push(({ name: '小先知书', books: LQ.range(28, 12).toArray() }));
        alls.push(({ name: '福音书', books: LQ.range(40, 5).toArray() })); // 使徒行传加到福音书(毕竟是路加写的下集)
        alls.push(({ name: '保罗书信', books: LQ.range(45, 13).toArray() }));
        alls.push(({ name: '其它书信', books: LQ.range(58, 9).toArray() })); // 希伯来书加在这56        
        BookClassor.allTypesGB = alls;      
      }
    }
  }
  public getAllClassors() {
    if (DisplayLangSetting.s.getValueIsGB()){
      return BookClassor.allTypesGB;
    }
    return BookClassor.allTypes;
  }

  /** 取得 books id, 如果是單卷, 例如 創, 則回傳 [1], 不存在, 回傳 [] */
  public getClassorsBooks(name: string): number[] {
    const r1 = LQ.from(this.getAllClassors()).firstOrDefault(a1 => a1.name === name);
    if (r1 !== undefined) {
      return r1.books;
    }
    if ( DisplayLangSetting.s.getValueIsGB()){
      const r2 = LQ.from(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS_GB).indexOf(name);
      if (r2 !== -1) {
        return [r2 + 1];
      }
    } else {
      const r2 = LQ.from(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS).indexOf(name);
      if (r2 !== -1) {
        return [r2 + 1];
      }
    }

    return [];
  }
}
