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
   * return 'http://bible.fhl.net/json/' at localhost.
   * return '/json/' at web. not 'bible.fhl.net/json/'
   *
   * 當時開發是給 sbdag.php 用的, 因為它有 cross 限制
   */
  getJsonUrl2(): string {
    return `${this.getDomain2()}json/`;
  }

  /**
   * 取得 .html 的位置 例如 http://bible.fhl.net/NUI/_rwd/
   * 這是在用 <a href> 的時候可能會用到的.
   * 例如: getHtmlURL() + '#/bible/Mt1:1-5'
   */
  getHtmlURL(): string {
    return window.location.pathname;
  }

}
