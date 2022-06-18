import { StorageTools } from './StorageTools';
import { EventTool } from './EventTool';
import { isDeepEqual } from "./isDeepEqual";
/**
 * 1. s。宣告一個 static s 用 static s = new XXXXXXXX();
 * 2. key。實作 getKey()
 * 3. default。可實作或不實作 getDefaultValue()
 */

export abstract class LocalStorageJsonBase<T> {
  protected curValue: T;
  protected eventTool = new EventTool<T>();

  // static s = new LocalStorageStringBase();
  /** ex. 'SearchBibleVersion' */
  get changed$() { return this.eventTool.changed$; }
  abstract _getKey(): string;
  /** 不用擔心初始化了嗎。建構子會從 localstorage 讀取. */
  getValue() { return this.curValue; }
  protected _getDefaultValue(): T { return undefined; }
  constructor() {
    const pthis = this;
    this.getFromLocalStorage();
    setTimeout(() => {
      this.eventTool.trigger(this.curValue);
    }, 0);
  }
  /** 若 a1 undefined, 則主動 trigger 目前值 */
  updateValueAndSaveToStorageAndTriggerEvent(a1?: T) {
    StorageTools.setJson<T>(this._getKey(), a1);
    if (isDeepEqual(a1, this.curValue) === false) {
      // 順序 先改 cur 值，再 trigger，因為有人會在 callback 中使用 getValue 而非用 callback 傳入的值 的可能
      this.curValue = a1; 
      this.eventTool.trigger(a1);
    }
  }

  /** 從 localstorage 讀取, 若不存在, 呼叫 _getDefaultValue() 初始化 */
  getFromLocalStorage() {
    this.curValue = StorageTools.getJsonSafely(this._getKey());
    if (this.curValue == null) {
      this.curValue = this._getDefaultValue();
    }
    return this.curValue;
  }
}
