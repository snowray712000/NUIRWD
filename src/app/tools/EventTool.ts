import { Observable, Subscriber, Subject, lastValueFrom, connectable, Connectable } from 'rxjs';

export class EventTool<T> {  
  changed$: Connectable<T>;
  private ob: Subscriber<T>;
  constructor() {
    const pthis = this;
    const r1 = new Observable<T>(ob => {
      pthis.ob = ob;
    });    
    lastValueFrom(r1) // 加這行, 上面那行才會先執行一次, 否則 ob 會是 undefined    
    this.changed$ = connectable( r1, {connector: () => new Subject<T>()} ) 
    this.changed$.connect();
  }
  trigger(arg: T) {
    this.ob.next(arg);
  }
}

/** 只能被一個 subscribe 若後面的人訂閱, 則只會觸發後面那個 */
export class EventToolSingle<T> {
  changed$: Observable<T>;
  private ob: Subscriber<T>;
  constructor() {
    const pthis = this;
    const r1 = new Observable<T>(ob => {
      pthis.ob = ob;
    });
    lastValueFrom(r1) // 加這行, 上面那行才會先執行一次, 否則 ob 會是 undefined    
    this.changed$ = r1;
  }
  trigger(arg: T) {
    this.ob.next(arg);
  }
  triggerComplete() {
    this.ob.complete();
  }
  triggerError(err: any) {
    this.ob.error(err);
  }
}
/** 進度列用, 使用 msg, progress */
export interface DProgressInfo {
  msg?: string;
  /** 0.0-100.0 */
  progress: number;
}
