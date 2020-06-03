import { IsLocalHostDevelopment } from './IsLocalHostDevelopment';
export class FhlUrl {
  /** bkbible.fhl.net or bible.fhl.net */
  getDomain(): string {
    // return IsLocalHostDevelopment.isLocalHost ? 'bkbible.fhl.net' : 'bible.fhl.net';
    return IsLocalHostDevelopment.isLocalHost || IsLocalHostDevelopment.isbkbibleHost ? 'http://bible.fhl.net/' : '/';

  }
  /** sbdag.php 用, 配 getJsonUrl2 */
  getDomain2(): string {
    // return IsLocalHostDevelopment.isLocalHost ? 'bkbible.fhl.net' : 'bible.fhl.net';
    return IsLocalHostDevelopment.isLocalHost ? 'http://bible.fhl.net/' : '/';

  }
  /** http://bible.fhl.net/json/ 當是 localhost, 若上網了, 就是 '/json/' 或 'http://bible.fhl.net/json/ */
  getJsonUrl(): string {
    return `${this.getDomain()}json/`;
  }
  /**
   * http://bible.fhl.net/json/ 當是 localhost,
   * 若上網了, 就是 '/json/' , 不會是 bible.fhl.net/json,
   * 這個 2 版本是給 sbdag.php 用的, 因為它會有 cross 限制
   */
  getJsonUrl2(): string {
    return `${this.getDomain2()}json/`;
  }
}
