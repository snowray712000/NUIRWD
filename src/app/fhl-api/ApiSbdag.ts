import { IsLocalHostDevelopment } from './IsLocalHostDevelopment';
import { ApiSdOrSbdagCore } from './ApiSdOrSbdagCore';
import { ApiSbdagPersudo } from './ApiSbdagPersudo';

/** 原文字典-浸宣出版-新約 */
export class ApiSbdag {
  queryQsbAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }) {
    if (!IsLocalHostDevelopment.isLocalHost) {
      return new ApiSdOrSbdagCore('sbdag').queryQsbAsync(arg);
    }

    return new ApiSbdagPersudo().queryQsbAsync(arg);
  }
}


