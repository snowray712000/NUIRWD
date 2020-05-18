export class IsLocalHostDevelopment {
  // tslint:disable-next-line: variable-name
  private static _isLocalHost: boolean;
  static get isLocalHost(): boolean {
    if (IsLocalHostDevelopment._isLocalHost === undefined) {
      IsLocalHostDevelopment._isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    }
    return IsLocalHostDevelopment._isLocalHost;
  }
}
