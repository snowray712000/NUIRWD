import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
/** 用 static .s */
export class IsColorKeyword extends LocalStorageBooleanBase {
  static s = new IsColorKeyword();
  _getKey(): string {
    return 'IsEnableColorKeyword';
  }
  _getDefaultValue() { return true; }

}
