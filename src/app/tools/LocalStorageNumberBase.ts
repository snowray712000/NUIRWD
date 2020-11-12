import { StorageTools } from './StorageTools';
import { EventTool } from './EventTool';




export abstract class LocalStorageNumberBase {
  protected curValue: number;
  protected eventTool = new EventTool<number>();

  // static s = new LocalStorageStringBase();
  /** ex. 'SearchBibleVersion' */
  get changed$() { return this.eventTool.changed$; }
  abstract _getKey(): string;
  protected _getDefaultValue(): number { return undefined; }
  constructor() {
    const pthis = this;
    this.getFromLocalStorage();
    setTimeout(() => {
      this.eventTool.trigger(this.curValue);
    }, 0);
  }
  /** 若 a1 undefined, 則主動 trigger 目前值 */
  updateValueAndSaveToStorageAndTriggerEvent(a1?: number) {
    StorageTools.setNumber(this._getKey(), a1);
    if (a1 !== this.curValue) {
      this.eventTool.trigger(a1);
      this.curValue = a1;
    }
  }
  getValue(): number {
    if (this.curValue === undefined) {
      this.getFromLocalStorage();
    }
    return this.curValue;
  }

  getFromLocalStorage() {
    this.curValue = StorageTools.getNumberSafely(this._getKey());        
    if (this.curValue == null) {
      this.curValue = this._getDefaultValue();
    }
    return this.curValue;
  }
}
