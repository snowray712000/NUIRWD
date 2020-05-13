import { Component, OnInit, PipeTransform, Pipe, ElementRef, AfterViewChecked, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { ApiQsb } from 'src/app/fhl-api/qsb';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { DOrigDict, IOrigDictQuery } from './cbol-dict.component-interfaces';
import { OrigDictQueryor } from './OrigDictQueryor';
import { OrigDictResultPreProcess } from './OrigDictResultPreProcess';
import { Observable, of } from 'rxjs';
import { VerseRange } from 'src/app/one-verse/show-data/VerseRange';
import { VerseAddress } from 'src/app/one-verse/show-data/VerseAddress';
import { BibleTextWithSnResultPreProcess } from './BibleTextWithSnResultPreProcess';


export interface IEventVerseChanged {
  changed$: Observable<{ book: number, chap: number, verse: number }>;
}


@Component({
  selector: 'app-cbol-dict',
  templateUrl: './cbol-dict.component.html',
  styleUrls: ['./cbol-dict.component.css']
})
export class CbolDictComponent implements OnInit, AfterViewChecked {
  data: DOrigDict[] = [];
  doms: SafeHtml[] = [];
  domThisVerse: SafeHtml;
  domsSn: any[] = [];
  origDictQ: IOrigDictQuery;
  checkedChinese = true;
  checkedEng = false;
  checkedSbdag = false;
  verseChanged$: IEventVerseChanged;
  thisVerseAddress: VerseAddress;
  thisVerseDescription: string;
  // tslint:disable-next-line: max-line-length
  constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef, public dialog: MatDialog, private detectChange: ChangeDetectorRef) {
    this.origDictQ = new OrigDictQueryor();

    this.thisVerseAddress = new VerseAddress(40, 1, 1);
    this.verseChanged$ = {
      changed$: of({ book: this.thisVerseAddress.book, chap: this.thisVerseAddress.chap, verse: this.thisVerseAddress.sec })
    };
  }
  ngOnInit() {
    this.bindVerseChangeEvent();
  }
  private bindVerseChangeEvent() {
    this.verseChanged$.changed$.subscribe(async (re) => {
      const r1 = new VerseRange();
      r1.add(new VerseAddress(re.book, re.chap, re.verse));
      this.thisVerseDescription = r1.toStringChineseShort();
      const qstr = r1.toStringEnglishShort();

      const r3 = await new ApiQsb().queryQsbAsync({ qstr, isExistStrong: true }).toPromise();
      // console.log(r3.record[0].bible_text);

      const r4 = new BibleTextWithSnResultPreProcess().preProcessToInnerHtml(r3.record[0].bible_text);
      this.domThisVerse = this.sanitizer.bypassSecurityTrustHtml(r4);
      this.detectChange.markForCheck();
    });
  }

  onClickPrevVerse() {

  }
  onClickNextVerse() {

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
    const r2 = this.elementRef.nativeElement.querySelectorAll('.sn');
    for (const a1 of r2) {
      if (this.domsSn.some(a2 => a1 === a2)) {
        continue;
      }
      this.domsSn.push(a1);
      a1.addEventListener('click', this.onClickSn.bind(this, a1));
    }
  }
  private createDomFromString(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str);
  }
  onClick(a1) {
    const checkStates = {
      isChinese: this.checkedChinese,
      isEng: this.checkedEng,
      isSbdag: this.checkedSbdag,
    };

    // console.log(a1);
    const sn = a1.getAttribute('sn');
    if (sn !== null) {
      const isOld = a1.getAttribute('isOld') === '1';
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { sn: parseInt(sn, 10), isOld, checkStates }
      });
    }
    const desc = a1.getAttribute('desc');
    if (desc != null) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { desc, checkStates }
      });
    }
  }
  onClickSn(a1) {
    const checkStates = {
      isChinese: this.checkedChinese,
      isEng: this.checkedEng,
      isSbdag: this.checkedSbdag,
    };

    const sn = a1.getAttribute('sn');
    if (sn !== null) {
      const isOld = a1.getAttribute('isOld') === '1';
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        data: { sn: parseInt(sn, 10), isOld, checkStates }
      });
    }
  }
  private formTextDivAndDealBr(str: string) {
    return new OrigDictResultPreProcess().preProcessToInnerHtml(str);
  }

}



