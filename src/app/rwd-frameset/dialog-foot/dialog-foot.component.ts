import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import { cvt_others } from 'src/app/bible-text-convertor/cvt_others';

@Component({
  selector: 'app-dialog-foot',
  templateUrl: './dialog-foot.component.html',
  styleUrls: ['./dialog-foot.component.css']
})
export class DialogFootComponent implements OnInit {
  public datas: DOneLine[];
  public verseRange: VerseRange;
  constructor(@Inject(MAT_DIALOG_DATA) public dataByParent: DText) {
  }


  ngOnInit(): void {
    const verses = new VerseRange();
    const ft = this.dataByParent.foot;
    verses.add({
      book: ft.book,
      chap: ft.chap,
      verse: ft.verse,
    });
    const r1: DText = {
      w: ft.text
    };
    let lines1 :DOneLine = {
      children:[r1],
      addresses:verses
    };
    this.datas = cvt_others([lines1],verses,ft.version+'_foot');  
    this.verseRange = verses;
  }

}
