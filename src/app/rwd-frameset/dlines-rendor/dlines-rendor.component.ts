import { EventVerseChanged } from './../../side-nav-right/cbol-parsing/EventVerseChanged';
import { VersionManager } from 'src/app/rwd-frameset/VersionManager';
import * as LQ from 'linq';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { Component, OnInit, Input } from '@angular/core';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { getAddressesText } from 'src/app/bible-address/getAddressesText';
import { DialogSearchResultOpenor } from '../search-result-dialog/DialogSearchResultOpenor';
import { IsVersionVisiableManager } from '../IsVersionVisiableManager';
import { MatDialog } from '@angular/material';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DisplayMergeSetting } from '../dialog-display-setting/DisplayMergeSetting';
import { DisplayLangSetting } from '../dialog-display-setting/DisplayLangSetting';
import { DisplayFormatSetting } from '../dialog-display-setting/DisplayFormatSetting';
import { mergeDOneLineIfAddressContinue } from 'src/app/bible-text-convertor/mergeDOneLineIfAddressContinue';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';

@Component({
  selector: 'app-dlines-rendor',
  templateUrl: './dlines-rendor.component.html',
  styleUrls: ['./dlines-rendor.component.css']
})
export class DlinesRendorComponent implements OnInit {
  @Input() datas: DOneLine[];
  verseRange: VerseRange = new VerseRange();
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  getDatasOrMergedDatas() {
    if (DisplayMergeSetting.s.getFromLocalStorage()) {
      return mergeDOneLineIfAddressContinue(this.datas);
    }
    return this.datas;
  }
  onClickVerse(it: DOneLine) {
    if (it.addresses !== undefined && it.addresses.verses.length !== 0) {
      EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(it.addresses.verses[0]);
    }
  }
  /** 供 html 用, 當 reference, 尾部點擊, 看上下文;(整章) */
  getReferenceEntireChap(a1: DOneLine) {
    if (a1 === undefined || a1.addresses === undefined || a1.addresses.verses === undefined) { return '#約3:16'; }
    const r1 = a1.addresses.verses[0];
    return '#' + BibleBookNames.getBookName(r1.book, BookNameLang.太) + r1.chap + '|';
  }
  getAddressShow(it: DOneLine) {
    const format = DisplayFormatSetting.s.getFromLocalStorage() as '1:1' | '1' | 'v1' | 'none';
    const lang = DisplayLangSetting.s.getFromLocalStorage() as '創' | 'Ge' | '创';
    return getAddressesText(it.addresses, format, lang);

  }

  onClickOrig(a1: string) {
    console.log(a1);

    new DialogSearchResultOpenor(this.dialog)
      .showDialog({ keyword: this.getOrigKeyword(a1), isDict: 1, addresses: this.verseRange.verses });
  }
  onClickReference(a1: string) {
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: a1, addresses: this.verseRange.verses });
  }
  /** 因為預計 output 是 G80 或 H80 但會出現 <G3956> 或 (G5720) 或 {<G3588>} 這些都要拿掉(脫殼) */
  getOrigKeyword(str: string) {
    const r1 = /(?:G|H)\d+[a-z]?/i.exec(str);
    return r1[0];
  }
  isVisibleVersion() {
    return IsVersionVisiableManager.s.getFromLocalStorage();
  }
  getVersionDisplayName(na: string) {
    if (VersionManager.s.cacheAbvResult === undefined) {
      return na;
    }

    const r2 = LQ.from(VersionManager.s.cacheAbvResult.record).firstOrDefault(a1 => a1.book === na);
    if (r2 === undefined) {
      return na;
    }
    return r2.cname;
  }
}
