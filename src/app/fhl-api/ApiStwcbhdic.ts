import { IsLocalHostDevelopment } from './IsLocalHostDevelopment';
import { ApiSdOrSbdagCore } from './ApiSdOrSbdagCore';
import { ApiStwcbhdicPersudo } from "./ApiStwcbhdicPersudo";
/** 原文字典-浸宣出版-舊約 */
export class ApiStwcbhdic {
  queryQsbAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }) {
    if (!IsLocalHostDevelopment.isLocalHost) {
      return new ApiSdOrSbdagCore('stwcbhdic').queryQsbAsync(arg);
    }
    return new ApiStwcbhdicPersudo().queryQsbAsync(arg);
  }
}
