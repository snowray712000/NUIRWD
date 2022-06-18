import { FunctionIsOpened } from './../FunctionIsOpened';
import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DialogRefOpenor } from '../info-dialog/DialogRefOpenor';
import { ChainToolDataGetter } from './ChainToolDataGetter';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DialogSearchResultOpenor } from 'src/app/rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { KeyedWrite } from '@angular/compiler';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
import { VerseActivedChangedDo } from '../cbol-parsing/VerseActivedChangedDo';
import { EventVerseChanged } from '../cbol-parsing/EventVerseChanged';
import { TestTime } from 'src/app/tools/TestTime';


@Component({
  selector: 'app-chain-tool',
  templateUrl: './chain-tool.component.html',
  styleUrls: ['./chain-tool.component.css']
})
export class ChainToolComponent implements OnInit {
  data: { w: string, des?: string }[][];
  address: DAddress = { book: 1, chap: 3, verse: 6 };
  next: DAddress;
  prev: DAddress;
  title: string;
  
  constructor(private detectChange: ChangeDetectorRef, private dialog: MatDialog) {  
  }

  onClickRef(arg: { w: string, des: string }) {
    const keyword = '#' + arg.des + '|';
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.address] });
  }
  ngOnInit() {
    var that = this
    VerseActivedChangedDo('串珠', addr => {

      var dt1 = new TestTime()
      that.data = [[{w:'取得資料中...' + addr.chap + ':' + addr.verse}]]
      dt1.log('串珠 清除資料.')
      // 讓畫面先更新
      setTimeout(async () => {                
        dt1.log('串珠 更新畫面1')
        await that.onVerseChanged(addr);
        dt1.log('串珠 verseChanged.')
        setTimeout(() => {
          dt1.log('串珠 更新畫面2')
        }, 0);
      }, 0);

    });
  }

  onClickPrev() {
    if (this.prev !== undefined) {
      EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(this.prev)
    }
  }
  onClickNext() {
    if (this.next !== undefined) {
      EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(this.next)
    }
  }

  private async onVerseChanged(arg: DAddress) {
    this.address = arg;
    const re = await new ChainToolDataGetter().mainAsync(this.address);
    this.prev = re.prev;
    this.next = re.next;
    this.title = re.title;
    this.data = re.data;
    // this.detectChange.markForCheck();
  }
}
