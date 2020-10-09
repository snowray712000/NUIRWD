import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
/** 用 static .s */

export class DisplayMergeSetting extends LocalStorageBooleanBase {
  static s = new DisplayMergeSetting();
  _getKey() { return 'displaymerge'; }
  _getDefaultValue() { return false; }
}
