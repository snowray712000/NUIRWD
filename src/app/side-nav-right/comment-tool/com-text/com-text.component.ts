import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DCommentDataQueryResult } from '../comment-tool-interfaces';
import { DialogRefOpenor } from '../../cbol-dict/info-dialog/DialogRefOpenor';
import { MatDialog } from '@angular/material/dialog';
import { DAddress } from 'src/app/bible-address/DAddress';
import { ReferenceFinder, DReferenceFinderOneResult } from './ReferenceFinder';
import { FixDesDefaultBookChap } from './FixDesDefaultBookChap';
import { OrigSNHorSNGFinder } from './OrigSNHorSNGFinder';
import { DialogOrigDictOpenor } from '../../cbol-dict/info-dialog/DialogOrigDictOpenor';

@Component({
  selector: 'app-com-text',
  templateUrl: './com-text.component.html',
  styleUrls: ['./com-text.component.css']
})
export class ComTextComponent implements OnInit, OnChanges {
  @Input() data: DCommentDataQueryResult;
  @Input() address: DAddress;
  data2: DDataShow[];
  constructor(private dialog: MatDialog) { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.dataToData2();
  }
  private dataToData2() {
    const fixer = new FixDesDefaultBookChap(this.address);
    const re = new ReferenceFinder({ fixDescriptor: fixer }).main(this.data.w);

    const re2: DDataShow[] = [];
    for (const it1 of re) {
      if (it1.des !== undefined) {
        re2.push(it1);
      } else {
        const r2 = new OrigSNHorSNGFinder().main(it1.w);
        for (const it2 of r2) {
          re2.push(it2);
        }
      }
    }
    this.data2 = re2;
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

interface DDataShow {
  w: string;
  des?: string;
  sn?: number;
  isOld?: boolean;
}


