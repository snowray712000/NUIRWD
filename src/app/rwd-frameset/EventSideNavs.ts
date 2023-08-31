import { Observable, Subscriber, lastValueFrom } from 'rxjs';
import { SideNavsOnFrame } from './SideNavsOnFrame';
export interface IEventSideNavs {
  /** true, 是打開, false 是關閉 */
  leftChanged$: Observable<boolean>;
  rightChanged$: Observable<boolean>;
}
export class EventSideNavs implements IEventSideNavs {
  leftChanged$: Observable<boolean>;
  rightChanged$: Observable<boolean>;
  private obLeft: Subscriber<boolean>;
  private obRight: Subscriber<boolean>;
  private navs: SideNavsOnFrame;
  constructor() {
    this.navs = new SideNavsOnFrame();
    this.leftChanged$ = new Observable<boolean>(obLeft => {
      this.obLeft = obLeft;
    });
    lastValueFrom(this.leftChanged$).then(a1 => { }); // 這樣, 下面的 this.obLeft 才不會是 undefined    
    this.rightChanged$ = new Observable<boolean>(obRight => {
      this.obRight = obRight;
    });
    lastValueFrom(this.rightChanged$).then(a1 => { });    
    this.navs.navLeft.openedChange.subscribe((st: boolean) => {
      this.obLeft.next(st);
    });
    this.navs.navRight.openedChange.subscribe((st: boolean) => {
      this.obRight.next(st);
    });
  }
}
