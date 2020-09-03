export class SearchSetting {
  loadSearchBibleVersion() {
    return SearchSettingSearchBibleVersion.s.getFromLocalStorage();
  }
  saveSearchBibleVersion(ver: string) {
    SearchSettingSearchBibleVersion.s.updateValueAndSaveToStorageAndTriggerEvent(ver);
  }
  loadSearchBibleSnVersion() {
    return SearchSettingSearchBibleSnVersion.s.getFromLocalStorage();
  }
  saveSearchSnBibleVersion(ver: string) {
    SearchSettingSearchBibleSnVersion.s.updateValueAndSaveToStorageAndTriggerEvent(ver);
  }
  loadIsEnableColorKeyword(): 0 | 1 {
    return SearchSettingIsEnableColorKeyword.s.getFromLocalStorage() ? 1 : 0;
  }
  saveIsEnableColorKeyword(a1: 0 | 1) {
    SearchSettingIsEnableColorKeyword.s.updateValueAndSaveToStorageAndTriggerEvent(a1 === 1);
  }
}


/** 用 static .s */
export class SearchSettingSearchBibleVersion extends LocalStorageStringBase {
  static s = new SearchSettingSearchBibleVersion();
  _getKey(): string {
    return 'SearchSnBibleVersion';
  }
  _getDefaultValue(): string {
    return 'unv';
  }
}
/** 用 static .s */
export class SearchSettingSearchBibleSnVersion extends LocalStorageStringBase {
  static s = new SearchSettingSearchBibleSnVersion();
  _getKey(): string {
    return 'SearchBibleSnVersion';
  }
  _getDefaultValue(): string {
    return 'unv';
  }
}
import { LocalStorageBooleanBase } from 'src/app/tools/LocalStorageBooleanBase';
import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';
/** 用 static .s */
export class SearchSettingIsEnableColorKeyword extends LocalStorageBooleanBase {
  static s = new SearchSettingIsEnableColorKeyword();
  _getKey(): string {
    return 'IsEnableColorKeyword';
  }
  _getDefaultValue() { return true; }

}
