import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRefOpenor } from '../info-dialog/DialogRefOpenor';
import { ChainToolDataGetter } from './ChainToolDataGetter';
import { DAddress } from 'src/app/bible-address/DAddress';
import { EventVerseChanged, IEventVerseChanged } from '../cbol-parsing/EventVerseChanged';
import { DialogSearchResultOpenor } from 'src/app/rwd-frameset/search-result-dialog/DialogSearchResultOpenor';
import { KeyedWrite } from '@angular/compiler';


@Component({
  selector: 'app-chain-tool',
  templateUrl: './chain-tool.component.html',
  styleUrls: ['./chain-tool.component.css']
})
export class ChainToolComponent implements OnInit, OnChanges {
  data: { w: string, des?: string }[][];
  address: DAddress = { book: 1, chap: 3, verse: 6 };
  eventVerseChanged: IEventVerseChanged;
  next: DAddress;
  prev: DAddress;
  title: string;
  @Input() addressActived;
  constructor(private detectChange: ChangeDetectorRef, private dialog: MatDialog) {
    this.eventVerseChanged = new EventVerseChanged();
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.addressActived !== undefined) {
      if (changes.addressActived.previousValue !== changes.addressActived.currentValue) {
        this.onVerseChanged(this.addressActived);
        this.address = this.addressActived;
      }
    }
    // throw new Error("Method not implemented.");
  }

  onClickRef(arg: { w: string, des: string }) {
    const keyword = '#' + arg.des + '|';
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword, addresses: [this.address] });
  }
  ngOnInit() {
    this.eventVerseChanged.changed$.subscribe(async arg => {
      await this.onVerseChanged(arg);
    });
  }

  onClickPrev() {
    if (this.prev !== undefined) {
      this.onVerseChanged(this.prev);
      this.address = this.prev;
    }
  }
  onClickNext() {
    if (this.next !== undefined) {
      this.onVerseChanged(this.next);
      this.address = this.next;
    }
  }

  private async onVerseChanged(arg: DAddress) {
    this.address = arg;
    const re = await new ChainToolDataGetter().mainAsync(this.address);
    this.prev = re.prev;
    this.next = re.next;
    this.title = re.title;
    this.data = re.data;
    this.detectChange.markForCheck();
  }
}
