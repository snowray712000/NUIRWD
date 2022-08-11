import { LocalStorageArrayBase } from '../../tools/LocalStorageArrayBase';

/**
 * 用 static .s
 * see also VerForMain
 */

export class VerOfOffenForMain extends LocalStorageArrayBase<string> {
  static s = new VerOfOffenForMain();
  _getKey(): string { return 'versionsOffens'; }
  override _isDefaultIfEmpty() { return true; }
  override _getDefaultValue() { return []; }
}
