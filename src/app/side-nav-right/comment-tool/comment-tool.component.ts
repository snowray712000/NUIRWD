import * as LQ from 'linq';
import { DialogSearchResultOpenor } from './../../rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { DText } from './../../bible-text-convertor/AddBase';
import { BookNameToId } from './../../const/book-name/book-name-to-id';
import { ApiSc } from 'src/app/fhl-api/ApiSc';
import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { DAddress, getNextAddress, getPrevAddress } from 'src/app/bible-address/DAddress';
import { CommentToolDataGetter } from './CommentToolDataGetter';
import { ICommentToolDataGetter, DCommentOneData } from './comment-tool-interfaces';
import { EventVerseChanged } from '../cbol-parsing/EventVerseChanged';
import { MatDialog } from '@angular/material/dialog';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { Comment2DText } from './Comment2DText';
import { AddReferenceInCommentText } from './AddReferenceInCommentText';
import { AddOrigDictInCommentText } from './AddOrigDictInCommentText';
import { FunctionIsOpened } from '../FunctionIsOpened';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
import { VerseActivedChangedDo } from '../cbol-parsing/VerseActivedChangedDo';
import { BookNameConstants } from 'src/app/const/book-name/BookNameConstants';
import { GetAddressRangeFromPrevNext } from 'src/app/bible-address/GetAddressRangeFromPrevNext';
import { getBig5Text } from 'src/app/gb/getGbText';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';

@Component({
  selector: 'app-comment-tool',
  templateUrl: './comment-tool.component.html',
  styleUrls: ['./comment-tool.component.css']
})
export class CommentToolComponent implements OnInit, OnChanges {
  address: DAddress = { book: 1, chap: 1, verse: 2 };
  // data: DCommentOneData[];
  data: DText[];
  dataQ: ICommentToolDataGetter;
  title: string;
  next: DAddress;
  prev: DAddress;
  @Input() addressActived: DAddress;
  private addresses = new VerseRange();
  constructor(private detector: ChangeDetectorRef, private dialog: MatDialog) {
    this.dataQ = new CommentToolDataGetter();
    // 先初始化他們
    FunctionIsOpened.s.getFromLocalStorage();
    FunctionSelectionTab.s.getFromLocalStorage();
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.addressActived !== undefined) {
      if (changes.addressActived.currentValue !== changes.addressActived.previousValue) {
        this.onVerseChanged(this.addressActived);
      }
    }
  }

  ngOnInit() {
    VerseActivedChangedDo('註釋', addr => {
      this.onVerseChanged(addr);
    });
  }
  private async onVerseChanged(arg: DAddress) {
    if (this.addresses.isIn(arg) === false) {
      this.address = arg;
      await this.getData();
      this.detector.markForCheck();
    }
  }
  onClickPrev() {
    if (this.prev !== undefined) {
      this.address = this.prev;
      this.getData();
    }
  }
  onClickNext() {
    if (this.next !== undefined) {
      this.address = this.next;
      this.getData();
    }
  }
  onClickReference(a1) {
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: a1, addresses: this.addresses.verses });
  }
  onClickOrig(a1) {
    new DialogSearchResultOpenor(this.dialog)
      .showDialog({ keyword: getOrigKeyword(a1), isDict: 1, addresses: this.addresses.verses });
    /** 因為預計 output 是 G80 或 H80 但會出現 <G3956> 或 (G5720) 或 {<G3588>} 這些都要拿掉(脫殼) */
    function getOrigKeyword(str: string) {
      const r1 = /(?:G|H)\d+[a-z]?/i.exec(str);
      return r1[0];
    }
  }
  async getData() {
    const pthis = this;
    this.data = undefined;
    const re1 = await queryCommentAsync(this.address);

    this.data = re1.data;
    setTitleAndPrevNext(re1);
    this.detector.markForCheck();
    return;
    function setTitleAndPrevNext(arg1: DCommentResult) {
      if (pthis.address.chap === 0) {
        pthis.title = DisplayLangSetting.s.getValueIsGB()? getBig5Text('書卷背景') : '書卷背景';
      } else {
        pthis.title = arg1.title;
      }

      pthis.next = arg1.next;
      pthis.prev = arg1.prev;
      let r1 = new GetAddressRangeFromPrevNext(re1.next, re1.prev);
      pthis.addresses = r1.verseRange;
    }
  }
}

interface DCommentResult { title: string; next?: DAddress; prev?: DAddress; data: DText[]; }
async function queryCommentAsync(addr: DAddress): Promise<DCommentResult> {
  const rr1 = await new ApiSc().queryScAsync({ bookId: 3, address: addr,isSimpleChinese: DisplayLangSetting.s.getValueIsGB() }).toPromise();
  // console.log(rr1);
  const rrData = cvtData(rr1.record[0].com_text, addr);

  return addNextPrevTitleAndGenerateResult(rrData);

  function addNextPrevTitleAndGenerateResult(data: DText[]) {
    const rr2 = rr1.record[0];
    const rre: DCommentResult = { data, title: rr2.title };
    if (rr1.next !== undefined) {
      rre.next = cvtAddr(rr1.next);
    }
    if (rr1.prev !== undefined) {
      rre.prev = cvtAddr(rr1.prev);
    }
    return rre;
  }
  function cvtAddr(aa1: { engs?: string, chap?: number, sec?: number }): DAddress {
    // 雖然 engs chap sec 一定會有, 但這樣宣告才能接 ApiSc 的 Result
    return { book: new BookNameToId().cvtName2Id(aa1.engs.toLowerCase()), chap: aa1.chap, verse: aa1.sec };
  }
  function cvtData(comtext: string, addrSet: DAddress): DText[] {
    const re1 = new Comment2DText().main(comtext, addrSet);
    const re2 = new AddReferenceInCommentText().main(re1, addrSet);
    const re3 = new AddOrigDictInCommentText().main(re2);
    return re3;
  }
}


