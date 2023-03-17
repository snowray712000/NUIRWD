import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';


export class IsParallelLayout extends LocalStorageBooleanBase {
  static s = new IsParallelLayout();
  _getKey(): string { return 'IsParallelLayout'; }
}
