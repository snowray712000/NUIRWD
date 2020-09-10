import { BookNameAndId } from './../const/book-name/BookNameAndId';
import * as LQ from 'linq';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SplitStringByRegexVer2, SplitStringByRegex } from '../tools/SplitStringByRegex';
import { ParsingReferenceDescription } from '../bible-address/ParsingReferenceDescription';
import { ApiQsb, QsbArgs } from '../fhl-api/ApiQsb';
import { FhlUrl } from '../fhl-api/FhlUrl';

@Component({
  selector: 'app-mobile-test',
  templateUrl: './mobile-test.component.html',
  styleUrls: ['./mobile-test.component.css']
})
export class MobileTestComponent implements OnInit {
  log: string;
  log2: string;
  log3: string;
  log4: string;
  log5: string;
  log6: string;
  log7: string;
  log8: string;
  log9: string;
  log10: string;
  log11: string;
  log12: string;
  constructor(private detectChange: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.params.subscribe((a1: { description?: string }) => {
      this.log = a1.description;
      this.log2 = VerseRange.fD(this.log).toStringChineseShort();
    });
  }

  ngOnInit() {
    const qstr = VerseRange.fD('傳1:1').toStringChineseShort();
    this.log4 = qstr;
    this.log5 = `${new FhlUrl().getJsonUrl()}qsb.php?gb=0&version=unv&qstr=${qstr}`;
    this.log6 = `${new FhlUrl().getJsonUrl2()}qsb.php?gb=0&version=unv&qstr=${qstr}`;
    const arg: QsbArgs = {
      qstr,
      bibleVersion: 'unv',
      isExistStrong: true,
      isSimpleChinese: false,
    };
    new ApiQsb().queryQsbAsync(arg).subscribe(re => {
      this.log3 = JSON.stringify(re);
    });
  }
  getHref(str) {
    return new FhlUrl().getHtmlURL() + '#/mobile/' + str;
  }
}


