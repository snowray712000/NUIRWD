import { DText } from 'src/app/bible-text-convertor/AddBase';
import { EventTool } from 'src/app/tools/EventTool';

/** 用 static .s */
export class SnActiveEvent {
  /** 滑鼠移過 sn 時，trigger 目前值 */
  static s = new SnActiveEvent();
  protected curValue: DText;
  protected eventTool = new EventTool<DText>();

  /** ex. '使用最好包在 setTimeout( ,0) 中間. 因為順序的關係, 這樣可確保訊息是在後面。 ' */
  get changed$() { return this.eventTool.changed$; }
  /** 若相同，則不trigger。trigger G8420 */
  updateValueAndTriggerEvent(a1?: DText) {
    if (a1 !== undefined) {
      if (g(a1) !== g(this.curValue)) {
        this.eventTool.trigger(a1);
        this.curValue = a1;
      }
    }
    /** G10421 */
    function g(a1: DText) {
      if (a1 === undefined)
        return '';
      return a1.tp + a1.sn;
    }
  }
  getCurrentValue() { return this.curValue; }
}

