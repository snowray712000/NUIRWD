import { Observable, Subscriber } from 'rxjs';
/** 用 static .s */
export class IsMapPhotoManager {
  static s = new IsMapPhotoManager();
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
  updateValueAndSaveToStorageAndTriggerEvent(a1: boolean) {
    localStorage.setItem('ismapphoto', a1 ? '1' : '0');
    if (a1 !== this.curValue) {
      this.ob.next(a1);
      this.curValue = a1;
    }
  }
  getFromLocalStorage() {
    const r1 = localStorage.getItem('ismapphoto');
    if (r1 === undefined) {
      return false;
    }
    if (r1 === '1') {
      return true;
    }
    return false;
  }
}
