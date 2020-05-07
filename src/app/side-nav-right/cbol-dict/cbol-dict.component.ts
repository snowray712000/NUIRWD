import { Component, OnInit, PipeTransform, Pipe, ElementRef, AfterViewChecked, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { ApiQsb } from 'src/app/fhl-api/qsb';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { DOrigDict, IOrigDictQuery } from './cbol-dict.component-interfaces';
import { OrigDictQueryor } from './OrigDictQueryor';
import { OrigDictResultPreProcess } from './OrigDictResultPreProcess';



@Component({
  selector: 'app-cbol-dict',
  templateUrl: './cbol-dict.component.html',
  styleUrls: ['./cbol-dict.component.css']
})
export class CbolDictComponent implements OnInit, AfterViewChecked {
  data: DOrigDict[] = [];
  doms: SafeHtml[] = [];
  domsSn: any[] = [];
  origDictQ: IOrigDictQuery;
  // tslint:disable-next-line: max-line-length
  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef, public dialog: MatDialog, private detectChange: ChangeDetectorRef) {
    this.origDictQ = new OrigDictQueryor();
  }

  ngAfterViewChecked(): void {
    const r1 = this.elementRef.nativeElement.querySelectorAll('.sn-or-ref');
    for (const a1 of r1) {
      if (this.domsSn.some(a2 => a1 === a2)) {
        continue;
      }
      this.domsSn.push(a1);
      a1.addEventListener('click', this.onClick.bind(this, a1));
    }
  }
  private createDomFromString(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
  onClick(a1) {
    // console.log(a1);
    const sn = a1.getAttribute('sn');
    if (sn !== null) {
      const isOld = a1.getAttribute('isOld') === '1';
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { sn: parseInt(sn, 10), isOld }
      });
    }
    const desc = a1.getAttribute('desc');
    if (desc != null) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { desc }
      });
    }
  }
  private formTextDivAndDealBr(str: string) {
    return new OrigDictResultPreProcess().preProcessToInnerHtml(str);
  }
  ngOnInit() {
    const r1$ = this.origDictQ.queryDictAsync({ sn: 11, isOldTestment: false, ver: '浸宣' }).subscribe(re1 => {
      this.data.push(re1);
      this.doms = this.data.map(a1 => this.createDomFromString(this.formTextDivAndDealBr(a1.text)));
      this.detectChange.markForCheck();
    });
  }
}


