import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { VerseRange } from '../one-verse/show-data/VerseRange';
import { Observable } from 'rxjs';
export class RouteStartedWhenFrame {
  private static routeStatic: ActivatedRoute;
  private static routerStatic: Router;
  private static routeTools: DRouteTools = {
    descriptionLast: undefined,
    verseRangeLast: undefined,
    verseRange$: undefined,
  };
  /**
   *
   * @param route 用來 subscribe 的
   * @param router 用來 navigate 的
   */
  constructor(route: ActivatedRoute = null, router: Router = null) {
    if (router != null) {
      RouteStartedWhenFrame.routerStatic = router;
    }
    if (route != null) {
      RouteStartedWhenFrame.routeStatic = route;
      this.descriptLastAndVerseLast(route);
    }
  }
  static isAlreadyExistRouteAndRouter() {
    return RouteStartedWhenFrame.routerStatic !== undefined && RouteStartedWhenFrame.routeStatic !== undefined;
  }
  private descriptLastAndVerseLast(route: ActivatedRoute) {
    const r2 = route.params.pipe(
      map(a1 => this.mapToVerseRange(a1)),
      // tap(a1 => console.log(a1))
      tap(a1 => {
        if (!this.isNullOrEmptyVerses(a1)) {
          this.routeTools.verseRangeLast = a1;
        }
      })
    );
    this.routeTools.verseRange$ = r2;
    r2.subscribe(a1 => { }); // 讓它運作
  }
  private mapToVerseRange(a1) {
    // console.log(res); // description: "Ro1:1-5.太3:1"
    // 因為 ; 在 angular 的 route 是特殊用途, 所以改 '.'
    const r1 = a1.description.replace(new RegExp('\\.', 'g'), ';');
    this.routeTools.descriptionLast = r1;
    if (this.isNullOrEmptyVerses(this.routeTools.verseRangeLast)) {
      return VerseRange.fromReferenceDescription(r1, 40);
    } else {
      const r3 = this.routeTools.verseRangeLast;
      return VerseRange.fromReferenceDescription(r1, r3.verses[0].book);
    }
  }
  private isNullOrEmptyVerses(a1: VerseRange) {
    return a1 === undefined || a1.verses.length === 0;
  }

  get route() { return RouteStartedWhenFrame.routeStatic; }
  get router() { return RouteStartedWhenFrame.routerStatic; }
  get routeTools() { return RouteStartedWhenFrame.routeTools; }
}

interface DRouteTools {
  /** verses: VerseAddress[] */
  verseRangeLast: VerseRange;
  /** ob of verseRangeLast */
  verseRange$: Observable<VerseRange>;
  /** Ro1:1-5;太3:1 */
  descriptionLast: string;
}
