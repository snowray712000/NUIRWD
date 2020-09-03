import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
/** 用 static .s */
export class IsSnManager extends LocalStorageBooleanBase {
  static s = new IsSnManager();
  _getKey(): string { return 'issn'; }
}
