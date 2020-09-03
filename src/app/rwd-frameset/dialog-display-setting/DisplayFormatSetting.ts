import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';
/** 用 static .s '創1:1' '1:1' '1' 'v1' '' */

export class DisplayFormatSetting extends LocalStorageStringBase {
  static s = new DisplayFormatSetting();
  _getKey() { return 'displayformat'; }
  _getDefaultValue() { return '創1:1'; }
}
