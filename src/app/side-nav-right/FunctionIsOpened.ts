import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
export class FunctionIsOpened extends LocalStorageBooleanBase {
  static s = new FunctionIsOpened();
  _getKey(): string {
    return 'FunctionIsOpened';
  }
}
