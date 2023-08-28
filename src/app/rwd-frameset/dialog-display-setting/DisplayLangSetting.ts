import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';

export type TpDisplayLangSetting = '創' | '创' | 'Ge'
/** 用 static .s '創', '创', 'Ge' */
export class DisplayLangSetting extends LocalStorageStringBase {
  static s = new DisplayLangSetting();
  _getKey() { return 'displaylang'; }
  override _getDefaultValue() { return '創'; } // 發版本 要改
  //override _getDefaultValue() { return '创'; }

  /** this.getFromLocalStorage() === '创'; */
  getFromLocalStorageIsGB(): boolean {
    return this.getFromLocalStorage() === '创';
  }
  getValueIsGB(): boolean {
    return this.getValue() === '创';
  }
  getValueIsEnglish(): boolean {
    return this.getValue() == "Ge"
  }
  // this.getValueIsGB()? BookNameLang.太GB : BookNameLang.太;
  getBookNameLangWhereIsGB(): BookNameLang {
    return this.getValueIsGB() ? BookNameLang.太GB : BookNameLang.太;
  }

  /**
   * 
   * @param idBook 1based
   * @returns "創"|"Ge"|"创"
   */
  getBookNameOfLangSet(idBook: number): string {
    const r1 = this.getValue()
    var langSet: BookNameLang = BookNameLang.太
    if (r1 == "Ge")
      langSet = BookNameLang.Mt
    else if (this.getValueIsGB())
      langSet = BookNameLang.太GB

    return BibleBookNames.getBookName(idBook, langSet);
  }
}
