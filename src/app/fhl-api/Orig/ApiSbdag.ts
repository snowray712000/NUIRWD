import { ApiSbdagPersudo } from './ApiSbdagPersudo';
import { IsLocalHostDevelopment } from '../IsLocalHostDevelopment';
import { queryOrigCore } from './queryOrigCore';

/** 原文字典-浸宣出版-新約 */
export class ApiSbdag {
  queryOrigAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
  }) {
    if (!IsLocalHostDevelopment.isLocalHost) {
      return queryOrigCore('sbdag.php', arg);
    }

    return new ApiSbdagPersudo().queryOrigAsync(arg);
  }
}


