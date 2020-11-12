import { LocalStorageNumberBase } from 'src/app/tools/LocalStorageNumberBase';

/**
 * 用 jquery 改 body 的 font-size，用 em 單位
 */

export class FontSize extends LocalStorageNumberBase {
  static s = new FontSize();
  constructor() {
    super();
    const pthis = this;
    setTimeout(() => {
      FontSize.setBodyFontSize(pthis.getValue());
    }, 0);
  }
  static setBodyFontSize(r1: number){
    let r2 = r1 + 'em';
    $('body').css('font-size', r2);
  }
  _getKey(): string {
    return 'fontsize';
  }
  _getDefaultValue(): number { return 1.0; }
}
