import { ApiSdOrSbdagCore } from './ApiSdOrSbdagCore';
export class ApiSd {
  queryQsbAsync(arg: {
    sn: number;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }) {
    const r1 = new ApiSdOrSbdagCore('sd').queryQsbAsync(arg);
    return r1;
  }
}
