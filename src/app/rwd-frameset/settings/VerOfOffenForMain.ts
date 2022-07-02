import { LocalStorageArrayBase } from '../../tools/LocalStorageArrayBase';

/**
 * 用 static .s
 * see also VerForMain
 */

export class VerOfOffenForMain extends LocalStorageArrayBase<string> {
  static s = new VerOfOffenForMain();
  _getKey(): string { return 'versionsOffens'; }
  _isDefaultIfEmpty() { return true; }
  _getDefaultValue() { return []; }
}
