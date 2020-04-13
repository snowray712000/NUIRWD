export interface DGlobalSetting {
  /** getter/setter [] ['unv','bbc'] */
  bibleVersions: Array<string>;
  /** 0: false, 1: open */
  isSN: number;
  /** 0: false, 1: open */
  isGB: number;
  /** 0: false, 1: open */
  isMapShow: number;
  /** 0: false, 1: open */
  isPhotoShow: number;

  /** ['bible/Zep/3/1'] 後面再說 */
  linkHistory: Array<string>;
}
