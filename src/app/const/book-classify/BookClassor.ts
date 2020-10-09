import * as LQ from 'linq';
import { BookNameConstants } from '../book-name/BookNameConstants';
export interface DOneBookClassor {
  name: string;
  books: number[];
}

export class BookClassor {
  static readonly allTypeNames = ['全部', '舊約', '新約'];
  private static allTypes: DOneBookClassor[] = [];

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
    return;
  }
  public getAllClassors() {
    return BookClassor.allTypes;
  }

  /** 取得 books id, 如果是單卷, 例如 創, 則回傳 [1], 不存在, 回傳 [] */
  public getClassorsBooks(name: string): number[] {
    const r1 = LQ.from(this.getAllClassors()).firstOrDefault(a1 => a1.name === name);
    if (r1 !== undefined) {
      return r1.books;
    }
    const r2 = LQ.from(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS).indexOf(name);
    if (r2 !== -1) {
      return [r2 + 1];
    }

    return [];
  }
}
