import { DAddress } from './../../bible-address/DAddress';
import { Directive, Input, ElementRef, HostListener, Output, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DialogSnDictOpenor } from './DialogSnDictOpenor';
import { DText } from 'src/app/bible-text-convertor/AddBase';
import { SearchResultDialogComponent } from 'src/app/rwd-frameset/search-result-dialog/search-result-dialog.component';
import { DialogSearchResultOpenor } from 'src/app/rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
@Directive({
  selector: '[appTextWithSn]'
})
export class TextWithSnDirective implements OnChanges {
  @Input() data: DText;
  @Input() snActived: string;
  @Input() addr: DAddress;
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
    const keyword = this.data.tp + this.data.sn; // H523 or G523
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.addr] });
  }
}


