import { Directive, Input, ElementRef, HostListener, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSnDictOpenor } from './DialogSnDictOpenor';
import { DText } from 'src/app/bible-text-convertor/AddBase';
@Directive({
  selector: '[appTextWithSn]'
})
export class TextWithSnDirective implements OnChanges {
  @Input() data: DText;
  @Input() snActived: string;
  constructor(private el: ElementRef, public dialog: MatDialog) {
    // this.el.nativeElement.style.color = 'darkturquoise';
    this.el.nativeElement.style.cursor = 'pointer';
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    // console.log(changes);
    if (this.data !== undefined && this.data.sn !== undefined && this.snActived !== undefined) {
      if (this.snActived === this.data.sn) {
        this.el.nativeElement.style.color = 'blue';
      } else {
        this.el.nativeElement.style.color = 'darkturquoise';
      }
    }
    // throw new Error("Method not implemented.");
  }
  @HostListener('mouseenter') onMouseEnter() {
  }

  @HostListener('mouseleave') onMouseLeave() {
  }
  @HostListener('click') onMouseClick() {
    new DialogSnDictOpenor(this.dialog).showDialog(this.data.sn, this.data.tp);
    // if (this.data.sn !== undefined) {
    //   const checkStates = {
    //     isChinese: true,
    //     isEng: true,
    //     isSbdag: true,
    //   };

    //   const isOld = this.data.tp === 'H';
    //   const dialogRef = this.dialog.open(InfoDialogComponent, {
    //     data: { sn: this.data.sn, isOld, checkStates }
    //   });
    // }
  }
}


