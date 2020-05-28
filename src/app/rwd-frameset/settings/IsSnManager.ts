import { Observable, observable, Subscriber } from 'rxjs';
import { ɵKeyEventsPlugin } from '@angular/platform-browser';

/** 用 static .s */
export class IsSnManager {
  static s = new IsSnManager();
  onChangedIsSn$: Observable<boolean>;
  private ob: Subscriber<boolean>;
  private curValue: boolean;
  constructor() {
    const pthis = this;
    this.onChangedIsSn$ = new Observable<boolean>(ob => {
      pthis.ob = ob;
    });
    this.onChangedIsSn$.toPromise(); // 加這行, pthis.ob = ob 裡面才會先執行一次
    this.curValue = this.getFromLocalStorage();
    if (this.ob !== undefined) {
      this.ob.next(this.curValue);
    }
  }
  /** 若 a1 undefined, 則主動 trigger 目前值 */
  updateValueAndSaveToStorageAndTriggerEvent(a1?: boolean) {
    if (a1 === undefined) {
      this.ob.next(this.curValue);
      return;
    }
    localStorage.setItem('issn', a1 ? '1' : '0');
    if (a1 !== this.curValue) {
      this.ob.next(a1);
      this.curValue = a1;
    }
  }

  getFromLocalStorage() {
    const r1 = localStorage.getItem('issn');
    if (r1 === undefined) {
      return false;
    }
    if (r1 === '1') {
      return true;
    }
    return false;
  }
}

