import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
/** 被用於 EventSideNavs, 唯一一次被真正初始化是 frame 的 onInit */
export class SideNavsOnFrame {
  private static sobj: SideNavsOnFrame;
  private left: MatSidenav;
  private right: MatSidenav;
  /** 只有 frame 一次有傳值, 其它人用不需要 */
  constructor(left?: MatSidenav, right?: MatSidenav) {
    if (left !== undefined && right !== undefined) {
      this.left = left;
      this.right = right;
      SideNavsOnFrame.sobj = this;
    }
  }
  get navLeft() { return SideNavsOnFrame.sobj.left; }
  get navRight() { return SideNavsOnFrame.sobj.right; }
}
