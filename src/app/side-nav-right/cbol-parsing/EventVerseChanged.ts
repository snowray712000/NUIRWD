import { Observable, Subscriber } from 'rxjs';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { DAddress } from 'src/app/bible-address/DAddress';
export interface IEventVerseChanged {
  changed$: Observable<DAddress>;
}
export class EventVerseChanged implements IEventVerseChanged {
  changed$: Observable<DAddress>;
  router: RouteStartedWhenFrame;
  private ob: Subscriber<DAddress>;
  constructor() {
    this.changed$ = new Observable<DAddress>(ob => {
      this.ob = ob;
    });
    this.changed$.toPromise().then(a1 => { }); // 使上面先強迫作一次, 下面用到 this.ob 才不會 undefined

    this.router = new RouteStartedWhenFrame();
    if (RouteStartedWhenFrame.isAlreadyExistRouteAndRouter()) {
      this.router.routeTools.verseRange$.subscribe(a1 => {
        const r1 = a1.verses[0];
        this.ob.next({ book: r1.book, chap: r1.chap, verse: r1.verse });
      });
    } else {
      this.ob.next({ book: 45, chap: 1, verse: 1 });
    }
  }
}
