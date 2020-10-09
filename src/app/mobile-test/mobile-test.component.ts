import { Dialog2bComponent } from './dialog2b/dialog2b.component';
import { BookNameAndId } from './../const/book-name/BookNameAndId';
import * as LQ from 'linq';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SplitStringByRegexVer2, SplitStringByRegex } from '../tools/SplitStringByRegex';
import { ParsingReferenceDescription } from '../bible-address/ParsingReferenceDescription';
import { ApiQsb, DQsbArgs } from '../fhl-api/ApiQsb';
import { FhlUrl } from '../fhl-api/FhlUrl';
import { OrigDictGetter } from '../rwd-frameset/search-result-dialog/OrigDictGetter';
import { OrigDictCBOLApiGetter } from '../rwd-frameset/search-result-dialog/OrigDictCBOLApiGetter';
import { KeywordSearchGetter } from '../rwd-frameset/search-result-dialog/KeywordSearchGetter';
import { searchAllIndexViaSeApiAsync } from '../rwd-frameset/search-result-dialog/searchAllIndexViaSeApiAsync';
import { EventTool } from '../tools/EventTool';

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

  }
  onClick5Freeze() {
    // const ts = new Date().getTime();
    // this.case2b().then(re => {
    //   console.log(re);
    // });

  }
  async case2b() {
    const dialogRef = this.dialog.open(Dialog2bComponent, {});
    const re = await dialogRef.afterClosed();
    return re;
  }
  getHref(str) {
    return new FhlUrl().getHtmlURL() + '#/mobile/' + str;
  }
}

