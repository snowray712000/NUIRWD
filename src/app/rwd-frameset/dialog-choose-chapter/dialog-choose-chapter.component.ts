import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameConstants } from 'src/app/const/book-name/BookNameConstants';
import { FontSize } from '../settings/FontSize';
import * as LQ from 'linq';
import { BookNameGetter } from 'src/app/const/book-name/BookNameGetter';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { getChapCount } from 'src/app/const/count-of-chap';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouteStartedWhenFrame } from '../RouteStartedWhenFrame';
import { DisplayLangSetting } from '../dialog-display-setting/DisplayLangSetting';
@Component({
  selector: 'app-dialog-choose-chapter',
  templateUrl: './dialog-choose-chapter.component.html',
  styleUrls: ['./dialog-choose-chapter.component.css']
})
export class DialogChooseChapterComponent implements OnInit {
  tp = "舊約"; // 舊約、新約、章
  book: number;
  chap: number;
  booksShow: { book: number; na: string; }[];
  stylesSet = "太"; // 太、馬太福音、Matt

  constructor(public detectChange: ChangeDetectorRef,
    public dialogRef: MatDialogRef<DialogChooseChapterComponent>) {
      let r1 = new RouteStartedWhenFrame().routeTools.verseRangeLast.verses;
      if ( r1.length !== 0){
        this.book = r1[0].book;
        this.chap = r1[0].chap;        
        
        if (this.book > 39){
          this.tp = "新約";
        }
      }      
    this.updateBooksShow();
  }

  updateBooksShow() {
    const pthis = this;
    let styles = this.stylesSet === '太' ? BookNameLang.太 : BookNameLang.馬太福音;
    if ( DisplayLangSetting.s.getValue() === '创'){
      styles = this.stylesSet === '太' ? BookNameLang.太GB : BookNameLang.马太福音GB;
    } else if ( DisplayLangSetting.s.getValue() === 'Ge'){
      styles = this.stylesSet === '太' ? BookNameLang.Mt : BookNameLang.Matthew;
    }

    this.booksShow = getBooksShow();
    return;
    function getBooksShow(): { book: number; na: string; }[] {
      switch (pthis.tp) {
        case '舊約': return getBooksOld();
        case '新約': return getBooksNew();
        case '希伯來排序': return getBooksOld2();
        case '章': return getChaps();
      }
      return [];
    }
    // return ['創','初','利','民','申'];
    function getBooksOld() {
      return LQ.from(type1[0].bks).select(a1 => ({
        book: a1,
        na: BibleBookNames.getBookName(a1, styles)
      })).toArray();
    }
    function getBooksNew() {
      return LQ.from(type1[1].bks).select(a1 => ({
        book: a1,
        na: BibleBookNames.getBookName(a1, styles)
      })).toArray();
    }
    function getBooksOld2() {
      return LQ.from(type1[2].bks).select(a1 => ({
        book: a1,
        na: BibleBookNames.getBookName(a1, styles)
      })).toArray();
    }
    function getChaps() {
      const r1 = getChapCount(pthis.book);
      return LQ.range(1, r1).select(a1 => ({ book: a1, na: a1.toString() })).toArray();
    }
  }

  onClickClassify(str: string) {
    // str: 舊約、新約、章   
    this.tp = str;
    this.updateBooksShow();

  }
  onClickFullName(){
    if ( this.stylesSet === '太'){
      this.stylesSet = "馬太福音";
    } else {
      this.stylesSet = "太";
    }
    this.updateBooksShow();
  }
  getFontSize() {
    return FontSize.s.getValue();
  }
  onClickOpts(it: { book: number, na: string }) {
    const pthis = this;
    if (this.tp !== '章') {
      this.book = it.book;

      if (getChapCount(this.book) === 1) {
        this.chap = 1 ;
        this.gotoUrl();
        this.dialogRef.close();
      } else {
        this.tp = '章';
        this.updateBooksShow();
      }
    } else {
      this.chap = it.book;
      this.gotoUrl();
      this.dialogRef.close();
    }
  }
  gotoUrl() {
    let na = BibleBookNames.getBookName(this.book, BookNameLang.太);
    let r1 = `/bible/${na}${this.chap}`;
    new RouteStartedWhenFrame().router.navigateByUrl(r1);
  }

  ngOnInit(): void {
  }


}
// http://www.hebrew.idv.tw/otconten.pdf 希伯來排序
const type1 = [
  { na: '舊約', bks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
  { na: '新約', bks: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] },
  {
    na: '希伯來排序', bks: [
      1, 2, 3, 4, 5,
      6, 7, 9, 10, 11, 12,
      23, 24, 26,
      28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      19, 20, 18,
      22, 8, 25, 21, 17,
      27, 15, 16, 13, 14,
    ]
  },
];