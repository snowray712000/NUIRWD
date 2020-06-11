import { Component, OnInit, Inject, ChangeDetectorRef, AfterViewChecked, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ApiQsb, QsbArgs } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { OrigDictQueryor } from './OrigDictQueryor';
import { OrigDictResultPreProcess } from './OrigDictResultPreProcess';
import { DInfoDialogData } from './DInfoDialogData';
import { linq_first } from 'src/app/linq-like/linq_first';
import { DialogRefOpenor } from './DialogRefOpenor';
import { DialogOrigDictOpenor } from './DialogOrigDictOpenor';
import { DictSourceVersionsTools } from './DictSourceVersionsTools';

export interface IRefContentQ {
  queryContentsAsync(arg: { description: string, engs?: string[] });
}
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css']
})
export class InfoDialogComponent implements OnInit, AfterViewChecked {
  isRef: boolean;
  innerHtmlContent: SafeHtml;
  innerHtmlTitle: SafeHtml;
  domsSn: any[] = [];
  // tslint:disable-next-line: max-line-length
  constructor(private elementRef: ElementRef, private sanitizer: DomSanitizer, private detectChange: ChangeDetectorRef, public dialog: MatDialog, public dialogRef: MatDialogRef<InfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public dataByParent: DInfoDialogData) {
    this.isRef = this.dataByParent.desc !== undefined;
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
  onClick(a1) {
    // console.log(a1);
    const sn = a1.getAttribute('sn');
    if (sn !== null) {
      const isOld = a1.getAttribute('isOld') === '1';
      new DialogOrigDictOpenor(this.dialog).showDialog({ sn, isOld });
    }
    const desc = a1.getAttribute('desc');
    if (desc != null) {
      new DialogRefOpenor(this.dialog).showDialog(desc);
    }
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
  /** ['中文','英文','浸宣'] or ['中文'] */
  private getVers(): string[] {
    // 設定檔, 與查詢參數不一定相同
    // 舊約內容, 不會有浸宣,
    // 這時, 傳給下個 info dialog 仍然傳3個
    // 但查詢時卻不會有浸宣字典 ;
    const isOld = this.dataByParent.isOld;
    const sts = this.dataByParent.checkStates;
    return new DictSourceVersionsTools().getDictSourceVersions(this.dataByParent.checkStates, isOld)
  }


  private async queryDictAndRefreshAsync() {
    const sn = this.dataByParent.sn;
    const isOldTestment = this.dataByParent.isOld;

    const vers = this.getVers();
    const tasks = vers.map(a1 => new OrigDictQueryor().queryDictAsync({
      sn,
      isOldTestment,
      ver: a1
    }).toPromise());
    const r1s = (await Promise.all(tasks)).filter(a1 => a1 !== null && a1.text !== null);
    // console.log(r1s);

    const domStr = r1s.map(a1 => {
      return `<span>${this.formTextDivAndDealBr(a1.text)}</span>`;
    }).join('<hr />');
    this.innerHtmlContent = this.sanitizer.bypassSecurityTrustHtml(domStr);

    const GorH = isOldTestment ? 'H' : 'G';
    const orig = linq_first(r1s.map(a1 => a1.orig), a1 => a1 !== undefined); // 浸宣版, 不會有 orig
    // tslint:disable-next-line: max-line-length
    this.innerHtmlTitle = `<span class="separatorParent"><span>${GorH}${sn}</span><span class="separator"></span><span>${orig}</span></span>`;
    this.detectChange.markForCheck();
  }

  private async queryReferenceAndRefreshAsync() {
    const r1 = await new ReferenceQuery().queryContentsAsync({
      description: this.dataByParent.desc
    }).toPromise();
    // console.log(r1);

    const title = this.dataByParent.desc;
    this.innerHtmlTitle = `<span>#${title}|</span>`;

    let i1 = 0;
    const domStr = r1.record.map(a1 => {
      i1++;
      const oddclass = i1 % 2 === 0 ? '' : 'odd';
      const domAddress = `<span class='bible-address'>${a1.chineses} ${a1.chap}:${a1.sec}</span>`;
      const dombibleText = `<span class='bible-text'>${a1.bible_text}</span>`;
      // return `<span class='one-verse'>${domAddress}&nbsp;${dombibleText}</span>`;
      return `<span class='one-verse ${oddclass}'>${dombibleText}(${domAddress})</span>`;
    }).join('');
    this.innerHtmlContent = this.sanitizer.bypassSecurityTrustHtml(domStr);
    this.detectChange.markForCheck();
  }

  onNoClick(): void {
    this.dialogRef.close();
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
    // const r3 = r2.toStringEnglishShort();
    const r3 = r2.toStringChineseShort();
    return new ApiQsb().queryQsbAsync({ qstr: r3 });
  }
}


