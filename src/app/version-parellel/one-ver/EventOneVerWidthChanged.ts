import { EventSideNavs } from "src/app/rwd-frameset/EventSideNavs";
// import { EventVersionsChanged } from 'src/app/side-nav-left/ver-select/EventVersionControlBridge';
import { Observable, Subscriber } from 'rxjs';
import { EventWindowSizeChanged } from 'src/app/rwd-frameset/EventWindowSizeChanged';
import { debounceTime } from 'rxjs/operators';
import { EventIsSnToggleChanged } from 'src/app/side-nav-left/side-nav-left.component';

/** 因版本變更, 總寬度改變, sidenav 壓縮因素
 * 每個 one-ver comp 要一個吧, 因為需要它們的 base ui 的 width 資訊
 *
 */
export class EventOneVerWidthChanged {
  private fnGetWidth: () => number;
  private widthPre: number;
  private width: number;
  private ob: Subscriber<number>;
  /** 1: 變大 -1: 變小 2: undefined變有值 */
  changed$: Observable<number>;
  constructor(fnGetWidth: () => number) {
    this.fnGetWidth = fnGetWidth;
    this.changed$ = new Observable<number>(ob => { this.ob = ob; });
    this.changed$.toPromise().then(a1 => { });
    // const eVer$ = new EventVersionsChanged();
    // eVer$.changed$.subscribe(vers => {
    //   this.chkIt();
    // });
    const eSide$ = new EventSideNavs();
    eSide$.leftChanged$.subscribe(isOpened => this.chkIt());
    eSide$.rightChanged$.subscribe(isOpened => this.chkIt());

    setTimeout(() => {
      const eWindowSizeChanged$ = new EventWindowSizeChanged();
      eWindowSizeChanged$.changed$.pipe(debounceTime(100)).subscribe(info => this.chkIt());
    }, 0);

  }
  private chkIt() {
    this.width = this.fnGetWidth();
    if (this.widthPre === undefined) {
      this.ob.next(2);
    } else if (this.widthPre < this.width) {
      this.ob.next(1);
    } else if (this.widthPre > this.width) {
      this.ob.next(-1);
    }
    this.widthPre = this.width;
  }
}
