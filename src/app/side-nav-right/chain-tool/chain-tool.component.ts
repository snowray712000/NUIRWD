import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { DialogSnDictOpenor } from '../cbol-parsing/DialogSnDictOpenor';
import { MatDialog } from '@angular/material/dialog';
import { DialogRefOpenor } from '../cbol-dict/info-dialog/DialogRefOpenor';
import { matchGlobalWithCapture } from 'src/app/tools/matchGlobalWithCapture';
import { ChainToolDataGetter } from './ChainToolDataGetter';
import { DAddress } from 'src/app/bible-address/DAddress';
import { IEventVerseChanged } from '../cbol-dict/cbol-dict.component';
import { EventVerseChanged } from '../cbol-parsing/EventVerseChanged';


@Component({
  selector: 'app-chain-tool',
  templateUrl: './chain-tool.component.html',
  styleUrls: ['./chain-tool.component.css']
})
export class ChainToolComponent implements OnInit {
  data: { w: string, des?: string }[][];
  address: DAddress = { book: 1, chap: 3, verse: 6 };
  eventVerseChanged: IEventVerseChanged;
  next: DAddress;
  prev: DAddress;
  title: string;
  constructor(private detectChange: ChangeDetectorRef, private dialog: MatDialog) {
    this.eventVerseChanged = new EventVerseChanged();
  }

  onClickRef(arg) {
    new DialogRefOpenor(this.dialog).showDialog(arg.des);
  }
  ngOnInit() {
    this.eventVerseChanged.changed$.subscribe(async arg => {
     await this.onVerseChanged(arg);
    });
  }
  onClickPrev() {
    if (this.prev !== undefined) {
      this.onVerseChanged(this.prev);
    }
  }
  onClickNext() {
    if (this.next !== undefined) {
      this.address = this.next;
      this.onVerseChanged(this.next);
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
