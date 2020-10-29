import { EventTool } from 'src/app/tools/EventTool';


export class ComBase<T> {
  get binded$() { return this.eventTool.changed$; }
  /** 用binded 事件可確保順序 */
  protected eventTool = new EventTool<T>();
  protected _com: T;
  setCom(arg: T) {
    if (arg !== undefined) {
      this._com = arg;
      this.eventTool.trigger(arg);
    }
  }
  /** _com._elementRef.nativeElement as HTMLElement */
  getAsHtmlElement(): HTMLElement {
    return getViewChildAsHtmlElement(this._com);

    function getViewChildAsHtmlElement(com: any): HTMLElement {

      if (com === undefined) {
        console.log('com is undefined.');
        return undefined;
      }
      if (com._elementRef === undefined) {
        console.log('com._elementRef is undefined.');
        return undefined;
      }
      if (com._elementRef.nativeElement === undefined) {
        console.log('com._elementRef.nativeElement is undefined.');
        return undefined;
      }
      return com._elementRef.nativeElement as HTMLElement;
    }
  }
}
