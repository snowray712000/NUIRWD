import { LocalStorageArrayBase } from "../tools/LocalStorageArrayBase";

/** 仿 IsSnManager 開發 */
export class VersionManager extends LocalStorageArrayBase<string> {
  static s = new VersionManager();
  _getKey(): string { return 'versions'; }
  _getDefaultValue() { return ['unv']; }
}


