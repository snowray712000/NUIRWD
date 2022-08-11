import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';

/** 用 static .s '創', '创', 'Ge' */

export class DisplayLangSetting extends LocalStorageStringBase {
  static s = new DisplayLangSetting();
  _getKey() { return 'displaylang'; }
  override _getDefaultValue() { return '創'; }

  /** this.getFromLocalStorage() === '创'; */
  getFromLocalStorageIsGB(): boolean {
    return this.getFromLocalStorage() === '创';
  }
  getValueIsGB(): boolean {
    return this.getValue() === '创';
  }
  // this.getValueIsGB()? BookNameLang.太GB : BookNameLang.太;
  getBookNameLangWhereIsGB(): BookNameLang {
    return this.getValueIsGB() ? BookNameLang.太GB : BookNameLang.太;
  }
}
