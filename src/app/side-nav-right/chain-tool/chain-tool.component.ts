import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { DialogSnDictOpenor } from '../cbol-parsing/DialogSnDictOpenor';
import { MatDialog } from '@angular/material/dialog';
import { DialogRefOpenor } from '../cbol-dict/info-dialog/DialogRefOpenor';
import { matchGlobalWithCapture } from 'src/app/tools/matchGlobalWithCapture';
import { ChainToolDataGetter } from './ChainToolDataGetter';
import { DAddress } from 'src/app/bible-address/DAddress';


@Component({
  selector: 'app-chain-tool',
  templateUrl: './chain-tool.component.html',
  styleUrls: ['./chain-tool.component.css']
})
export class ChainToolComponent implements OnInit {
  data: { w: string, des?: string }[][];
  address: DAddress = { book: 1, chap: 3, sec: 6 };
  constructor(private detectChange: ChangeDetectorRef, private dialog: MatDialog) { }

  onClickRef(arg) {
    new DialogRefOpenor(this.dialog).showDialog(arg.des);
  }
  ngOnInit() {
    this.getData();
  }
  async getData() {
    this.data = await new ChainToolDataGetter().mainAsync(this.address);
    this.detectChange.markForCheck();
  }
}
