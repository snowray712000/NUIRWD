import { StorageTools } from './StorageTools';
import { EventTool } from './EventTool';
/**
 * 1. s。宣告一個 static s 用 static s = new XXXXXXXX();
 * 2. key。實作 getKey()
 * 3. default。可實作或不實作 getDefaultValue()
 */

export abstract class LocalStorageBooleanBase {
  protected curValue: boolean;
  protected eventTool = new EventTool<boolean>();

  // static s = new LocalStorageStringBase();
  /** ex. '使用最好包在 setTimeout( ,0) 中間. 因為順序的關係, 這樣可確保訊息是在後面。 ' */
  get changed$() { return this.eventTool.changed$; }
  abstract _getKey(): string;
  protected _getDefaultValue(): boolean { return undefined; }
  constructor() {
    const pthis = this;
    this.getFromLocalStorage();
    setTimeout(() => {
      this.eventTool.trigger(this.curValue);
    }, 0);
  }
  /** 若 a1 undefined, 則主動 trigger 目前值 */
  updateValueAndSaveToStorageAndTriggerEvent(a1?: boolean) {
    StorageTools.setBoolean(this._getKey(), a1);
    if (a1 !== this.curValue) {
      this.eventTool.trigger(a1);
      this.curValue = a1;
    }
  }

  getFromLocalStorage() {
    this.curValue = StorageTools.getBooleanSafely(this._getKey());
    if (this.curValue == null) {
      this.curValue = this._getDefaultValue();
    }
    return this.curValue;
  }
}
