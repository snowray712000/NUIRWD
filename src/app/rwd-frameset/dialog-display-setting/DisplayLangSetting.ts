import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';

/** 用 static .s '創', '创', 'Ge' */

export class DisplayLangSetting extends LocalStorageStringBase {
  static s = new DisplayLangSetting();
  _getKey() { return 'displaylang'; }
  _getDefaultValue() { return '創'; }
}
