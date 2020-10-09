import { LocalStorageStringBase } from '../tools/LocalStorageStringBase';
export class FunctionSelectionTab extends LocalStorageStringBase {
  static s = new FunctionSelectionTab();
  _getKey(): string {
    return 'FunctionSelectionTab';
  }
  _getDefaultValue(): string {
    return '註釋';
  }
}
