import { Observable, Subscriber } from 'rxjs';
export class EventTool<T> {
  changed$: Observable<T>;
  private ob: Subscriber<T>;
  constructor() {
    const pthis = this;
    this.changed$ = new Observable<T>(ob => {
      pthis.ob = ob;
    });
    this.changed$.toPromise(); // 加這行, 上面那行才會先執行一次, 否則 ob 會是 undefined
  }
  trigger(arg: T) {
    this.ob.next(arg);
  }
}




