import { StorageTools } from './StorageTools';
import { EventTool } from './EventTool';
/**
 * 1. s。宣告一個 static s 用 static s = new XXXXXXXX();
 * 2. key。實作 getKey()
 * 3. default。可實作或不實作 getDefaultValue()
 */
export abstract class LocalStorageStringBase {
  protected curValue: string;
  protected eventTool = new EventTool<string>();

  // static s = new LocalStorageStringBase();
  /** ex. 'SearchBibleVersion' */
  get changed$() { return this.eventTool.changed$; }
  abstract _getKey(): string;
  protected _getDefaultValue(): string { return undefined; }
  constructor() {
    const pthis = this;
    this.getFromLocalStorage();
    setTimeout(() => {
      this.eventTool.trigger(this.curValue);
    }, 0);
  }
  /** 若 a1 undefined, 則主動 trigger 目前值 */
  updateValueAndSaveToStorageAndTriggerEvent(a1?: string) {
    StorageTools.setString(this._getKey(), a1);
    if (a1 !== this.curValue) {
      this.eventTool.trigger(a1);
      this.curValue = a1;
    }
  }

  getFromLocalStorage() {
    this.curValue = StorageTools.getStringSafely(this._getKey());
    if (this.curValue == null) {
      this.curValue = this._getDefaultValue();
    }
    return this.curValue;
  }
}



