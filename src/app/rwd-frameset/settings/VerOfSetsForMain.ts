import { LocalStorageArrayBase } from '../../tools/LocalStorageArrayBase';
import { VerForMain } from './VerForMain';

/**
 * 用 static .s
 * see also VerForMain
 */

export class VerOfSetsForMain extends LocalStorageArrayBase<string[]> {
  static s = new VerOfSetsForMain();
  _getKey(): string { return 'versionsOfSets'; }
  override _isDefaultIfEmpty() { return true; }
  override _getDefaultValue() { return []; }
}
