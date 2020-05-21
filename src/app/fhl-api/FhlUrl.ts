import { IsLocalHostDevelopment } from './IsLocalHostDevelopment';
export class FhlUrl {
  /** bkbible.fhl.net or bible.fhl.net */
  getDomain(): string {
    // return IsLocalHostDevelopment.isLocalHost ? 'bkbible.fhl.net' : 'bible.fhl.net';
    return IsLocalHostDevelopment.isLocalHost ? 'http://bible.fhl.net/' : '/';
  }
  /** http://bkbible.fhl.net/json/ or http://bible.fhl.net/json/ */
  getJsonUrl(): string {
    return `${this.getDomain()}json/`;
  }
}
