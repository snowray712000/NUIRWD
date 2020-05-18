import { ApiSdOrSbdagCore } from './ApiSdOrSbdagCore';
import { ApiSbdagPersudo } from "./ApiSbdagPersudo";
import { IsLocalHostDevelopment } from './IsLocalHostDevelopment';
export class ApiSbdag {
  queryQsbAsync(arg: {
    sn: number;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }) {
    if (!IsLocalHostDevelopment.isLocalHost) {
      return new ApiSdOrSbdagCore('sbdag').queryQsbAsync(arg);
    }

    return new ApiSbdagPersudo().queryQsbAsync(arg);
  }
}


