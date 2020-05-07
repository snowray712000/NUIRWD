import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ApiQsb, QsbArgs } from 'src/app/fhl-api/qsb';
import { VerseRange } from 'src/app/one-verse/show-data/VerseRange';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

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
  title: string;
  innerHtmlContent: SafeHtml;
  // tslint:disable-next-line: max-line-length
  constructor(private sanitizer: DomSanitizer, private detectChange: ChangeDetectorRef, public dialog: MatDialog, public dialogRef: MatDialogRef<InfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: { desc?: string, sn?: number, isOld?: boolean }) {
    console.log(this.dataByParent);
    this.isRef = this.dataByParent.desc !== undefined;

  }

  ngOnInit() {
    this.dataQueryAsync();
  }
  async dataQueryAsync() {
    if (this.isRef) {
      await this.queryReferenceAndRefreshAsync();
    } else {

    }
  }
  private async queryReferenceAndRefreshAsync() {
    const r1 = await new ReferenceQuery().queryContentsAsync({
      description: this.dataByParent.desc
    }).toPromise();
    this.title = this.dataByParent.desc;
    // console.log(r1);
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
