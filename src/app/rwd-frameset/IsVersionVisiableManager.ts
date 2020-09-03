import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
/** 仿 IsSnManager class 實作 */
export class IsVersionVisiableManager extends LocalStorageBooleanBase {
  static s: IsVersionVisiableManager = new IsVersionVisiableManager();
  _getKey(): string { return 'isversionvisiable'; }
}
