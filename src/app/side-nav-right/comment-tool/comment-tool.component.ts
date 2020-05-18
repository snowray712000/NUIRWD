import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DAddress } from 'src/app/bible-address/DAddress';
import { CommentToolDataGetter } from './CommentToolDataGetter';
import { ICommentToolDataGetter, DCommentOneData } from './comment-tool-interfaces';
import { IEventVerseChanged } from '../cbol-dict/cbol-dict.component';
import { EventVerseChanged } from '../cbol-parsing/EventVerseChanged';

@Component({
  selector: 'app-comment-tool',
  templateUrl: './comment-tool.component.html',
  styleUrls: ['./comment-tool.component.css']
})
export class CommentToolComponent implements OnInit {
  address: DAddress = { book: 1, chap: 1, verse: 2 };
  data: DCommentOneData[];
  dataQ: ICommentToolDataGetter;
  title: string;
  next: DAddress;
  prev: DAddress;
  eventVerseChanged: IEventVerseChanged;
  constructor(private detector: ChangeDetectorRef) {
    this.dataQ = new CommentToolDataGetter();
    this.eventVerseChanged = new EventVerseChanged();
  }

  ngOnInit() {
    this.eventVerseChanged.changed$.subscribe(async arg => {
      console.log(arg);
      await this.onVerseChanged(arg);
    });
  }
  private async onVerseChanged(arg: DAddress) {
    this.address = arg;
    await this.getData();
    this.detector.markForCheck();
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
  async getData() {
    const r1 = await this.dataQ.mainAsync(this.address);
    if (this.address.chap === 0) {
      this.title = '書卷背景';
    } else {
      this.title = r1.title;
    }
    // console.log(r1);

    this.next = r1.next;
    this.prev = r1.prev;
    this.data = r1.data;

  }
}
