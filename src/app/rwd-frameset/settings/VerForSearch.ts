import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';
/**
 * 用 static .s
 * 有3種版本設定，經文版本設定；Reference時/搜尋關鍵字時版本設定；原文彙編時版本設定
 * VerForMain VerForSearch VerForSnSearch
 */
export class VerForSearch extends LocalStorageStringBase {
  static s = new VerForSearch();
  _getKey(): string {
    return 'SearchSnBibleVersion';
  }
  override _getDefaultValue(): string {
    return 'unv';
  }
}
