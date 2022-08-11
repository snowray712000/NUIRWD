import { MatSidenav } from '@angular/material/sidenav';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { ComBase } from './ComBase';

export class ComToolbarTop extends ComBase<MatToolbar> {
  static s = new ComToolbarTop();   
}
export class ComSideNavRight extends ComBase<MatSidenav> {
  static s = new ComSideNavRight();  
}
export class ComSideNavLeft extends ComBase<MatSidenav>{
  static s = new ComSideNavLeft();
}
export class ComMatGroup extends ComBase<MatTabGroup>{
  static s = new ComMatGroup();
}
export class ComMatTabCommentInfo extends ComBase<MatTab>{
  static s = new ComMatTabCommentInfo();
}
