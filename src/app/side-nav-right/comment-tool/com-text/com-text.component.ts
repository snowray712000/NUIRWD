import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DCommentOneData } from '../comment-tool-interfaces';
import { DialogRefOpenor } from '../../info-dialog/DialogRefOpenor';
import { MatDialog } from '@angular/material/dialog';
import { DAddress } from 'src/app/bible-address/DAddress';
import { DReferenceFinderOneResult } from './ReferenceFinder';
import { DialogOrigDictOpenor } from '../../info-dialog/DialogOrigDictOpenor';
import { ReferenceAndOrigFinderUsingAtCommentTool } from './ReferenceAndOrigFinderUsingAtCommentTool';
import { DCommonetDataShow } from "./DCommonetDataShow";

@Component({
  selector: 'app-com-text',
  templateUrl: './com-text.component.html',
  styleUrls: ['./com-text.component.css']
})
export class ComTextComponent implements OnInit, OnChanges {
  @Input() data: DCommentOneData;
  @Input() address: DAddress;
  data2: DCommonetDataShow[];
  constructor(private dialog: MatDialog) { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.dataToData2();
  }
  private dataToData2() {
    this.data2 = new ReferenceAndOrigFinderUsingAtCommentTool()
    .main(this.data.w, this.address);
  }

  ngOnInit() {
  }
  getColor() {
    const r1 = this.data.level;
    // tslint:disable-next-line: curly
    if (r1 % 2 === 0) return '#000';
    return '#070';
  }
  onClickDes(a1: DReferenceFinderOneResult) {
    new DialogRefOpenor(this.dialog).showDialog(a1.des);
  }
  onClickOrig(a1) {
    const sn = a1.sn;
    const isOld = a1.isOld;
    new DialogOrigDictOpenor(this.dialog).showDialog({ sn, isOld });
  }
}



