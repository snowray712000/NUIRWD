import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { DTextWithSnConvertorResult } from './TextWithSnConvertor';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from 'src/app/side-nav-right/cbol-dict/info-dialog/info-dialog.component';
@Directive({
  selector: '[appTextWithSn]'
})
export class TextWithSnDirective {
  @Input() data: DTextWithSnConvertorResult;
  constructor(private el: ElementRef, public dialog: MatDialog) {
    // 若沒有 settimeout , data 會是 undefined
    setTimeout(() => {
      if (this.data !== undefined && this.data.sn !== undefined) {
        this.el.nativeElement.style.color = 'darkturquoise';
        this.el.nativeElement.style.cursor = 'pointer';
      }
    }, 0);
  }
  @HostListener('mouseenter') onMouseEnter() {
  }

  @HostListener('mouseleave') onMouseLeave() {
  }
  @HostListener('click') onMouseClick() {
    console.log('hi');

    if (this.data.sn !== undefined) {
      const checkStates = {
        isChinese: true,
        isEng: true,
        isSbdag: true,
      };

      const isOld = this.data.tp === 'H';
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { sn: this.data.sn, isOld, checkStates }
      });
    }
  }
}
