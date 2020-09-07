import { SearchSetting } from './../search-result-dialog/SearchSetting';
import * as LQ from 'linq';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { IsVersionVisiableManager } from '../IsVersionVisiableManager';
import { DisplayFormatSetting } from './DisplayFormatSetting';
import { DisplayLangSetting } from './DisplayLangSetting';
import { DisplayMergeSetting } from './DisplayMergeSetting';
import { IsSnManager } from '../settings/IsSnManager';

@Component({
  selector: 'app-dialog-display-setting',
  templateUrl: './dialog-display-setting.component.html',
  styleUrls: ['./dialog-display-setting.component.css']
})
export class DialogDisplaySettingComponent implements OnInit {

  datas: DOneLine[] = [
    // tslint:disable-next-line: max-line-length
    { children: [{ w: '起初' }, { w: '<H09002>', sn: 'H09002', tp: 'H' }, { w: '，　' }, { w: '神' }, { w: '<H0430>', sn: 'H0430', tp: 'H', keyIdx0based: 2 }, { w: '創造天地。' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },

    // tslint:disable-next-line: max-line-length
    { children: [{ w: '地是空虛混沌，淵面黑暗；　' }, { w: '神' }, { w: '<H0430>', sn: 'H0430', tp: 'H', keyIdx0based: 2 }, { w: '的靈運行在水面上。' }], addresses: VerseRange.fD('創1:2'), ver: '和合本' },

    // tslint:disable-next-line: max-line-length
    { children: [{ w: '主為' }, { w: '我們', keyIdx0based: 0 }, { w: '捨命，' }, { w: '我們', keyIdx0based: 0 }, { w: '從此就知道何為' }, { w: '愛', keyIdx0based: 1 }, { w: '；' }, { w: '我們' }, { w: '也當為弟兄捨命。' }], addresses: VerseRange.fD('約一3:16'), ver: '和合本' },

    { children: [{ w: '凡有世上財物的，看見弟兄窮乏，卻硬著心腸不理，他怎能說他心裡有　神的愛呢？' }], addresses: VerseRange.fD('約一3:17'), ver: '新譯本' },


  ];
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogDisplaySettingComponent>,
    private changeDetector: ChangeDetectorRef) {

  }

  ngOnInit() {
  }
  isFormatActived(text: string) {
    return getFormatSetting() === text;
    function getFormatSetting() {
      return DisplayFormatSetting.s.getFromLocalStorage();
    }
  }
  onClickFormat(text: string) {
    DisplayFormatSetting.s.updateValueAndSaveToStorageAndTriggerEvent(text);
  }
  isLangActived(text: string) {
    return DisplayLangSetting.s.getFromLocalStorage() === text;
  }
  onClickLang(text: string) {
    DisplayLangSetting.s.updateValueAndSaveToStorageAndTriggerEvent(text);
  }
  isMergeActived(text: string) {
    return DisplayMergeSetting.s.getFromLocalStorage();
  }
  onClickMerge() {
    DisplayMergeSetting.s.updateValueAndSaveToStorageAndTriggerEvent(!DisplayMergeSetting.s.getFromLocalStorage());
  }
  onClickSnVisibleToggle() {
    IsSnManager.s.updateValueAndSaveToStorageAndTriggerEvent(!IsSnManager.s.getFromLocalStorage());
  }
  isSnShowOn() {
    return IsSnManager.s.getFromLocalStorage();
  }
  isVersionShowOn() {
    return IsVersionVisiableManager.s.getFromLocalStorage();
  }
  onClickVersionToggle() {
    IsVersionVisiableManager.s.updateValueAndSaveToStorageAndTriggerEvent(!IsVersionVisiableManager.s.getFromLocalStorage());
  }
  onClickColorKeywordToggle() {
    const re = this.isEnableColorKeyword() ? 0 : 1;
    new SearchSetting().saveIsEnableColorKeyword(re);
  }
  isEnableColorKeyword() {
    return new SearchSetting().loadIsEnableColorKeyword() === 1;
  }
}


