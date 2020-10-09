import { ApiStwcbhdicPersudo } from "./ApiStwcbhdicPersudo";
import { IsLocalHostDevelopment } from '../IsLocalHostDevelopment';
import { queryOrigCore } from './queryOrigCore';
/** 原文字典-浸宣出版-舊約 */
export class ApiStwcbhdic {
  queryOrigAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
  }) {
    if (!IsLocalHostDevelopment.isLocalHost) {
      return queryOrigCore('stwcbhdic.php', arg);
    }
    return new ApiStwcbhdicPersudo().queryOrigAsync(arg);
  }
}
