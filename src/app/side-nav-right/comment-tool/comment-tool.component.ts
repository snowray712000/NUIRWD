import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DAddress } from 'src/app/bible-address/DAddress';
import { CommentToolDataGetter } from './CommentToolDataGetter';
import { ICommentToolDataGetter } from './comment-tool-interfaces';

@Component({
  selector: 'app-comment-tool',
  templateUrl: './comment-tool.component.html',
  styleUrls: ['./comment-tool.component.css']
})
export class CommentToolComponent implements OnInit {
  address: DAddress = { book: 1, chap: 1, verse: 2};
  data: any;
  dataQ: ICommentToolDataGetter;
  constructor(private detector: ChangeDetectorRef) {
    this.dataQ = new CommentToolDataGetter();
  }

  ngOnInit() {
    this.getData();
  }
  async getData() {
    this.data = await this.dataQ.mainAsync(this.address);
    this.detector.markForCheck();
  }
}
