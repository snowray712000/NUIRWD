import { Component, OnInit, PipeTransform, Pipe, ElementRef, AfterViewChecked, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { ApiQsb } from 'src/app/fhl-api/qsb';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { DOrigDict, IOrigDictQuery } from './cbol-dict.component-interfaces';
import { OrigDictQueryor } from './OrigDictQueryor';



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
    console.log(a1);
    const sn = a1.getAttribute('sn');
    const desc = a1.getAttribute('desc');
    if (sn !== null) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        // width: '250px',
        // data: { name: this.name, animal: this.animal }
      });
    }
    if (desc != null) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        // width: '250px',
        data: { desc: desc }
      });
    }
  }
  private formTextDivAndDealBr(str: string) {
    str = str.replace(/\r*\n/g, '<br />');
    str = str.replace(/\s+(?:SN){0,1}H(\d+)\s*/g, (a1, a2, a3) => {
      // a1: ' H65 ' a2: 65 或 a1: ' SNH65 ' a2: 65
      // sd api, 是 SNH, 所以
      const sn = parseInt(a2, 10);
      return ` <span class="sn-or-ref" sn=${sn} isOld="1">&lt;H${sn}&gt;</span> `;
    });
    str = str.replace(/\s+(G(\d+))\s*/g, (a1, a2, a3) => {
      // a1: ' H65 ' a2: 'G65' a3: '65'
      return ` <span class="sn-or-ref" sn=${a3} isOld="0">&lt;${a2}&gt;</span> `;
    });
    str = str.replace(/#([^\|]+)\|/g, (a1, a2, a3) => {
      // 重點1, #不是跳脫字元, |是.
      // 重點2, 與H98 G98不一樣, #不一定前面有空白
      return ` <span class="sn-or-ref" desc=${a2} isOld="0">${a1}</span> `;
    });

    return str;
  }
  ngOnInit() {
    const r1$ = this.origDictQ.queryQsbAsync({ sn: 11, isOldTestment: false, ver: '浸宣' }).subscribe(re1 => {
      this.data.push(re1);
      this.doms = this.data.map(a1 => this.createDomFromString(this.formTextDivAndDealBr(a1.text)));
      this.detectChange.markForCheck();
    });
  }
}
