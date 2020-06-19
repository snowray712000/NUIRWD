import { Observable } from 'rxjs';
export class EventVersionsChanged {
  changed$: Observable<string[]>;
  constructor() {
    this.changed$ = new EventVersionControlBridge().version$;
  }
}
/** 使用者使用 EventVersionsChanged 這個 */
export class EventVersionControlBridge {
  private static sobj: EventVersionControlBridge;
  private vers$: Observable<string[]>;
  constructor(vers$?: Observable<string[]>) {
    if (vers$ !== undefined) {
      this.vers$ = vers$;
      EventVersionControlBridge.sobj = this;
    }
  }
  get version$() { return EventVersionControlBridge.sobj.vers$; }
}
