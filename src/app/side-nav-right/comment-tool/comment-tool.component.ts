import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core';
import { DAddress } from 'src/app/bible-address/DAddress';
import { CommentToolDataGetter } from './CommentToolDataGetter';
import { ICommentToolDataGetter, DCommentOneData } from './comment-tool-interfaces';
import { EventVerseChanged, IEventVerseChanged } from '../cbol-parsing/EventVerseChanged';
import { ReferenceAndOrigFinderUsingAtCommentTool } from './com-text/ReferenceAndOrigFinderUsingAtCommentTool';
import { DCommonetDataShow } from './com-text/DCommonetDataShow';
import { DialogRefOpenor } from '../info-dialog/DialogRefOpenor';
import { MatDialog } from '@angular/material/dialog';
import { DialogOrigDictOpenor } from '../info-dialog/DialogOrigDictOpenor';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { GetAddressRangeFromPrevNext } from 'src/app/bible-address/GetAddressRangeFromPrevNext';

@Component({
  selector: 'app-comment-tool',
  templateUrl: './comment-tool.component.html',
  styleUrls: ['./comment-tool.component.css']
})
export class CommentToolComponent implements OnInit, OnChanges {
  address: DAddress = { book: 1, chap: 1, verse: 2 };
  data: DCommentOneData[];
  dataQ: ICommentToolDataGetter;
  title: string;
  next: DAddress;
  prev: DAddress;
  eventVerseChanged: IEventVerseChanged;
  @Input() addressActived: DAddress;
  private addresses = new VerseRange();
  constructor(private detector: ChangeDetectorRef, private dialog: MatDialog) {
    this.dataQ = new CommentToolDataGetter();
    this.eventVerseChanged = new EventVerseChanged();
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.addressActived !== undefined) {
      if (changes.addressActived.currentValue !== changes.addressActived.previousValue) {
        this.onVerseChanged(this.addressActived);
      }
    }
  }

  ngOnInit() {
    this.eventVerseChanged.changed$.subscribe(async arg => {
      // console.log(arg); // book:45,chap:1,verse:1
      await this.onVerseChanged(arg);
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
  onClickRefOrOrig(a1: DCommonetDataShow) {
    if (a1.des !== undefined) {
      new DialogRefOpenor(this.dialog).showDialog(a1.des);
    } else if (a1.sn !== undefined) {
      new DialogOrigDictOpenor(this.dialog).showDialog({ sn: a1.sn, isOld: a1.isOld });
    }
  }
  async getData() {
    const r1 = await this.dataQ.mainAsync(this.address);
    if (this.address.chap === 0) {
      this.title = '書卷背景';
    } else {
      this.title = r1.title;
    }

    this.next = r1.next;
    this.prev = r1.prev;
    this.data = r1.data;

    r1.data.filter(a1 => a1.iReg === undefined).forEach(a1 => {
      const re1 = new ReferenceAndOrigFinderUsingAtCommentTool().main(a1.w, this.address);
      a1.child2 = re1;
    });


    this.addresses = new GetAddressRangeFromPrevNext(r1.next, r1.prev).verseRange;
  }
}
