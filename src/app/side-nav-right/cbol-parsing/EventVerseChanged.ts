import { IEventVerseChanged } from './cbol-parsing-interfaces';
import { Observable, Subscriber } from 'rxjs';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
interface DAddress {
  book: number;
  chap: number;
  verse: number;
}
export class EventVerseChanged implements IEventVerseChanged {
  changed$: Observable<DAddress>;
  router: RouteStartedWhenFrame;
  private ob: Subscriber<DAddress>;
  constructor() {
    const pthis = this;
    this.changed$ = new Observable<DAddress>(ob => {
      this.ob = ob;
      // 這段不能放在放面, 因為可能會比 ob 有值時還早會呼叫, 那 ob.next 就會失敗了 ;
      this.router = new RouteStartedWhenFrame();
      if (RouteStartedWhenFrame.isAlreadyExistRouteAndRouter()) {
        this.router.routeTools.verseRange$.subscribe(a1 => {
          const r1 = a1.verses[0];
          this.ob.next({ book: r1.book, chap: r1.chap, verse: r1.sec });
        });
      } else {
        this.ob.next({ book: 7, chap: 2, verse: 1 });
      }
    });
  }
}
