import { Observable, Subscriber, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
/** 手機旋轉 與 size 改變, 都會觸發 */
export class EventWindowSizeChanged {
  private static sobj: EventWindowSizeChanged;
  // tslint:disable-next-line: variable-name
  private _changed$: Observable<DEventWindowSizeChanged>;
  constructor() {
    if (EventWindowSizeChanged.sobj === undefined) {
      EventWindowSizeChanged.sobj = this;
      EventWindowSizeChanged.sobj._changed$ = this.init();
    }
  }
  get changed$() { return EventWindowSizeChanged.sobj._changed$; }

  private init() {
    const r1 = fromEvent(window, 'resize');
    const r2 = r1.pipe(map(a1 => {
      // tslint:disable-next-line: deprecation
      const rr1 = a1.srcElement as any;
      return {
        width: rr1.outerWidth,
        height: rr1.outerHeight,
      } as DEventWindowSizeChanged;
    }));
    return r2;
  }
}
export interface DEventWindowSizeChanged {
  width: number;
  height: number;
}
