import { VerseRange } from 'src/app/bible-address/VerseRange';
import { log } from 'util';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { DText } from '../bible-text-convertor/AddBase';
import { DAddress } from '../bible-address/DAddress';
import { BookNameToId } from '../const/book-name/book-name-to-id';
import { Comment2DText } from '../side-nav-right/comment-tool/Comment2DText';
import { AddReferenceInCommentText } from '../side-nav-right/comment-tool/AddReferenceInCommentText';
import { AddOrigDictInCommentText } from '../side-nav-right/comment-tool/AddOrigDictInCommentText';
import { DialogSearchResultOpenor } from '../rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  constructor(private detector: ChangeDetectorRef, private dialog: MatDialog) { }
  data: DText[];
  addresses: VerseRange = VerseRange.fD('太1:1-2;創1:1-2');
  isVisibleInput = true;
  @ViewChild('textInput', null) btnToggleBkCh;

  ngOnInit() {
    const relast = window.localStorage.getItem('edit');
    // this.btnToggleBkCh.nativeElement.value = relast === undefined ? '' : relast;
    this.updateView();
  }
  onClickToggle() {
    const pthis = this;
    if (isChangeToResult()) {
      this.updateView();
    }
    this.isVisibleInput = !this.isVisibleInput;
    return;
    function isChangeToResult() { return pthis.isVisibleInput; }
  }
  updateView() {
    if (this.btnToggleBkCh === undefined) { return; }
    const r1 = this.btnToggleBkCh.nativeElement;
    let r2 = r1.value as string;
    if (r2 === undefined || r2.length === 0) {
      r2 = this.getExample();
    }
    this.updateData(r2);
  }
  getToggleText() {
    return this.isVisibleInput ? '顯示結果' : '顯示編輯';
  }

  onFocusout(e) {
    const dom = e.target;
    const re = $(dom).val() as string;
    if (re == null || re.trim().length === 0) {
      $('#text-input').val($('#text-input2').val());
    }
    window.localStorage.setItem('edit', re);
    this.updateData(re);


  }
  updateData(text) {
    // 參考註釋
    const addr = { book: 40, chap: 1, verse: 1 };
    const rrData = cvtData(text, addr);
    this.data = rrData;
    // re = 'G02532';
    // let re = parseTextToOrigOrReference(re);
    // $('#show').html(re);
    // findPrsingTableSnClassAndLetItCanClick(0, $('#show'));

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
  getExample() {
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
