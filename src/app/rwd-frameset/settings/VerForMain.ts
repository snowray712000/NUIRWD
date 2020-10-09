import { LocalStorageArrayBase } from '../../tools/LocalStorageArrayBase';
/**
 * 用 static .s
 * 有3種版本設定，經文版本設定；Reference時/搜尋關鍵字時版本設定；原文彙編時版本設定
 * VerForMain VerForSearch VerForSnSearch
 */
export class VerForMain extends LocalStorageArrayBase<string> {
  static s = new VerForMain();
  _getKey(): string { return 'versions'; }
  _getDefaultValue() { return ['unv']; }
}


