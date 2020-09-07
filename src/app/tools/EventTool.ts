import { Observable, Subscriber, Subject, ConnectableObservable } from 'rxjs';
import { multicast } from 'rxjs/operators';
export class EventTool<T> {
  changed$: ConnectableObservable<T>;
  private ob: Subscriber<T>;
  constructor() {
    const pthis = this;
    const r1 = new Observable<T>(ob => {
      pthis.ob = ob;
    });
    r1.toPromise(); // 加這行, 上面那行才會先執行一次, 否則 ob 會是 undefined
    this.changed$ = r1.pipe(multicast(new Subject<T>())) as ConnectableObservable<T>;
    this.changed$.connect();
    // https://ncjamieson.com/understanding-publish-and-share/
  }
  trigger(arg: T) {
    this.ob.next(arg);
  }
}



