import * as LINQ from "linq";
import { BookNameConstants } from './BookNameConstants';
/** 用於 Regex 建立過程 */

export class BookNameGetter {
  static getAllNames() {
    const re2 = BookNameConstants.CHINESE_BOOK_ABBREVIATIONS
      .concat(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS_GB)
      .concat(BookNameConstants.CHINESE_BOOK_NAMES)
      .concat(BookNameConstants.CHINESE_BOOK_NAMES_GB)
      .concat(BookNameConstants.ENGLISH_BOOK_ABBREVIATIONS)
      .concat(BookNameConstants.ENGLISH_BOOK_NAMES)
      .concat(BookNameConstants.ENGLISH_BOOK_SHORT_ABBREVIATIONS);
    return re2;
  }
  static getAllChineseNames() {
    const re2 = BookNameConstants.CHINESE_BOOK_ABBREVIATIONS
      .concat(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS_GB)
      .concat(BookNameConstants.CHINESE_BOOK_NAMES)
      .concat(BookNameConstants.CHINESE_BOOK_NAMES_GB);
    return re2;
  }
  /** ['約貳', '約壹', '約參', '約翰壹書', '約翰貳書', '約翰參書', '约贰', '约壹', '约参', '约翰壹书', '约翰贰书', '约翰参书'] */
  static getAllSpecialChineseNames(){
    return ['約貳', '約壹', '約參', '約翰壹書', '約翰貳書', '約翰參書', '约贰', '约壹', '约参', '约翰壹书', '约翰贰书', '约翰参书'];
  }
  static getAllOrderByLengthDesc() {
    return LINQ.from(this.getAllNames()).orderByDescending(a1 => a1.length).toArray();
  }

}
