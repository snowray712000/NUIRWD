import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ApiQsb, QsbArgs } from 'src/app/fhl-api/qsb';
import { VerseRange } from 'src/app/one-verse/show-data/VerseRange';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { OrigDictQueryor } from '../OrigDictQueryor';
import { OrigDictResultPreProcess } from '../OrigDictResultPreProcess';

export interface IRefContentQ {
  queryContentsAsync(arg: { description: string, engs?: string[] });
}

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit {
  isRef: boolean;
  innerHtmlContent: SafeHtml;
  innerHtmlTitle: SafeHtml;
  // tslint:disable-next-line: max-line-length
  constructor(private sanitizer: DomSanitizer, private detectChange: ChangeDetectorRef, public dialog: MatDialog, public dialogRef: MatDialogRef<InfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: { desc?: string, sn?: number, isOld?: boolean }) {
    this.isRef = this.dataByParent.desc !== undefined;
  }

  ngOnInit() {
    this.dataQueryAsync();
  }
  async dataQueryAsync() {
    if (this.isRef) {
      await this.queryReferenceAndRefreshAsync();
    } else {
      await this.queryDictAndRefreshAsync();
    }
  }
  private async queryDictAndRefreshAsync() {
    const sn = this.dataByParent.sn;
    const isOldTestment = this.dataByParent.isOld;
    const r1 = await new OrigDictQueryor().queryDictAsync({
      sn,
      isOldTestment,
    }).toPromise();
    // console.log(r1);
    const domStr = `<span>${this.formTextDivAndDealBr(r1.text)}</span>`;
    this.innerHtmlContent = this.sanitizer.bypassSecurityTrustHtml(domStr);
    const GorH = isOldTestment ? 'H' : 'G';
    // tslint:disable-next-line: max-line-length
    this.innerHtmlTitle = `<span class="separatorParent"><span>${GorH}${r1.sn}</span><span class="separator"></span><span>${r1.orig}</span></span>`;
    this.detectChange.markForCheck();
  }

  private async queryReferenceAndRefreshAsync() {
    const r1 = await new ReferenceQuery().queryContentsAsync({
      description: this.dataByParent.desc
    }).toPromise();
    // console.log(r1);

    const title = this.dataByParent.desc;
    this.innerHtmlTitle = `<span>#${title}|</span>`;

    const domStr = r1.record.map(a1 => {
      // tslint:disable-next-line: max-line-length
      return `<span class='one-verse'><span class='bible-address'>${a1.chineses} ${a1.chap}:${a1.sec}</span>&nbsp;<span class='bible-text'>${a1.bible_text}</></span>`;
    }).join('');
    this.innerHtmlContent = this.sanitizer.bypassSecurityTrustHtml(domStr);
    this.detectChange.markForCheck();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClick() {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      // width: '250px',
      // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  private formTextDivAndDealBr(str: string) {
    return new OrigDictResultPreProcess().preProcessToInnerHtml(str);
  }
}
class ReferenceQuery implements IRefContentQ {
  queryContentsAsync(arg: { description: string; engs?: string[]; }) {
    // console.log(res); // description: "Ro1:1-5.太3:1"
    // 因為 ; 在 angular 的 route 是特殊用途, 所以改 '.'
    const r1 = arg.description.replace(new RegExp('\\.', 'g'), ';');
    const r2 = VerseRange.fromReferenceDescription(r1, 40);
    const r3 = r2.toStringEnglishShort();
    const r4 = new QsbArgs();
    r4.qstr = r3;
    return new ApiQsb().queryQsbAsync(r4);
  }
}
