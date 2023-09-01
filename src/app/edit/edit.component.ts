import { DOneLine } from "./../bible-text-convertor/DOneLine";
import { EventTool } from 'src/app/tools/EventTool';
import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { DText } from "../bible-text-convertor/DText";
import { DAddress } from '../bible-address/DAddress';
import { Comment2DText } from '../side-nav-right/comment-tool/Comment2DText';
import { AddReferenceInCommentText } from '../side-nav-right/comment-tool/AddReferenceInCommentText';
import { AddOrigDictInCommentText } from '../side-nav-right/comment-tool/AddOrigDictInCommentText';
import { DialogSearchResultOpenor } from '../rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { MatDialog } from '@angular/material/dialog';
import { Connectable, ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  isVisibleVE = new ValueEvent(true);
  data: DOneLine[];
  addresses: VerseRange = VerseRange.fD('太1:1-2;創1:1-2');
  @ViewChild('textInput', { static: false }) textInput;
  constructor(private detector: ChangeDetectorRef, private dialog: MatDialog) { }
  get isEdit(): boolean { return this.isVisibleVE.get(); }
  setEdit(str: string) {
    this.textInput.nativeElement.value = str;
  }
  getEdit(): string {
    return this.textInput.nativeElement.value as string;
  }
  ngOnInit() {
    setTimeout(() => {
      this.setEdit(MyEdit.s.getValue());
    }, 0);

    this.isVisibleVE.changed$.subscribe(re => {
      if (this.isEdit) {
        // 要加 timeout 不然 textInput 會是 undefined
        setTimeout(() => {
          // tslint:disable-next-line: curly
          if (this.textInput !== undefined)
            this.setEdit(MyEdit.s.getValue());
        }, 0);

      } else {

        this.updateData(MyEdit.s.getValue());

      }
    });

  }

  onClickToggle() {
    // 存檔
    if (this.isEdit) {
      const r1 = this.textInput.nativeElement.value as string;
      if (r1 !== undefined && r1.length !== 0) {
        MyEdit.s.updateValueAndSaveToStorageAndTriggerEvent(r1);
      }
    }

    // 切換
    this.isVisibleVE.setAndTrigger(!this.isEdit);
    const pthis = this;
    if (isChangeToResult()) {
      // this.updateView();
    }
    return;
    function isChangeToResult() { return !pthis.isEdit; }
  }
  updateView() {
    if (this.textInput === undefined) { return; }
    const r1 = this.textInput.nativeElement;
    const r2 = r1.value as string;
    if (r2 !== undefined && r2.length !== 0) {
      this.updateData(r2);
    }
  }
  getToggleText() {
    return this.isEdit ? '顯示結果' : '顯示編輯';
  }
  updateData(text) {
    // 參考註釋
    const addr = { book: 40, chap: 1, verse: 1 };
    const rrData = cvtData(text, addr);

    const rrData2: DOneLine[] = [{ children: rrData }];
    this.data = rrData2;

    function cvtData(comtext: string, addrSet?: DAddress): DText[] {
      const re1 = new Comment2DText().main(comtext, addrSet);
      const re2 = new AddReferenceInCommentText().main(re1, addrSet);
      const re3 = new AddOrigDictInCommentText().main(re2);
      return re3;
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
  onKeydown(e) {
    // 防止 tab https://www.jianshu.com/p/2732f6a2f398
    if (e.keyCode === 9) { // Tab
      e.preventDefault(); // 不作原本的行為
      onPressTab(this);
    }
    //  else if (e.keyCode === 27) { // Esc
    //   e.preventDefault();
    // $(e.target).focusout();
    // }
    return;
    function onPressTab(pthisTextarea) {
      const space4 = '    ';
      const start = pthisTextarea.selectionStart;
      const end = pthisTextarea.selectionEnd;
      if (start === end) {
        document.execCommand('insertText', false, space4);
      } else {
        const strBefore = pthisTextarea.value.slice(0, start);
        const curLineStart = strBefore.includes('\n') ? strBefore.lastIndexOf('\n') + 1 : 0;
        const strBetween = pthisTextarea.value.slice(curLineStart, end + 1);
        const newStr = space4 + strBetween.replace(/\n/g, '\n  ');
        const lineBreakCount = strBetween.split('\n').length;
        const newStart = start + space4.length;
        const newEnd = end + (lineBreakCount + 1) * space4.length;

        pthisTextarea.setSelectionRange(curLineStart, end);
        document.execCommand('insertText', false, newStr);
        pthisTextarea.setSelectionRange(newStart, newEnd);
      }
    }
  }
}

class ValueEvent<T> {
  protected curValue: T;
  protected events = new EventTool<T>();
  constructor(initial: T) {
    this.curValue = initial;
  }
  setAndTrigger(arg: T) {
    this.curValue = arg;
    this.events.trigger(arg);
  }
  get(): T { return this.curValue; }
  get changed$(): Connectable<T> { return this.events.changed$; }
}
class MyEdit extends LocalStorageStringBase {
  static s = new MyEdit();
  _getKey(): string {
    return 'MyEdit';
  }
  override _getDefaultValue(): string {
    return getExample();
    function getExample() {
      return `
      這是範例:
      ☆ 原文字典
          ☆ 描述中，用G2532表示希臘原文 Greek
          ☆ 描述中，用H113表示希伯來原文 Hebrew

      ☆ 參考經文
          ☆ （אַבְרָהָם H85「多人之父」）「亞伯拉罕」。出現於耶穌的家譜中，#太1:1,2,17;路3:34|。
          ☆ 參考規則，請參閱 <a href='http://bible.fhl.net/new/allreadme.html'>信望愛經文參照查詢</a> 第三點
          ✩ 目前此處只開放，中文縮寫「創、初、利」... 以後會再加上其它的。

      ☆ 建議符號 (以後會以這個為開發方式)
          「●」：經文註釋
          「◎」：個人感想與應用
          「○」：相關經文
          「☆」：特殊注意事項
          ☆ https://a2z.fhl.net/php/pcom.php?book=3&engs=Matt&chap=0
          ✩ 愈接近上格式, 會轉的愈漂亮，(若開發好後)`;
    }
  }

}
