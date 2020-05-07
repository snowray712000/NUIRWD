import { ApiSdOrSbdagCore } from './ApiSdOrSbdagCore';
import { ApiSbdagPersudo } from "./ApiSbdagPersudo";
export class ApiSbdag {
  private static isLocalhost: boolean;
  queryQsbAsync(arg: {
    sn: number;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }) {
    if (ApiSbdag.isLocalhost === undefined) {
      ApiSbdag.isLocalhost = location.hostname === 'localhost';
    }
    if (!ApiSbdag.isLocalhost) {
      return new ApiSdOrSbdagCore('sbdag').queryQsbAsync(arg);
    }
    return new ApiSbdagPersudo().queryQsbAsync(arg);
  }
}
