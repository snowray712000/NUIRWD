import { DListAdd } from './../../rwd-frameset/search-result-dialog/dtexts-rendor/addListStartAndEnd';
import { Component, OnInit } from '@angular/core';
import { UT } from './UT';
import { test_newLineNewLineSplit } from './test_newLineNewLineSplit';
import { test_mergeTextAtCommentText } from './test_mergeTextAtCommentText';
import { test_prepareDataForAddOrderAndListAtComment } from './test_prepareDataForAddOrderAndListAtComment';
import { test_addListStartAndEndUnitTests } from './test_addListStartAndEndUnitTests';
import { addListStartAndEnd } from 'src/app/rwd-frameset/search-result-dialog/dtexts-rendor/addListStartAndEnd';

import { DText } from 'src/app/bible-text-convertor/AddBase';
import { test_AddReferenceInCommentText } from 'src/app/side-nav-right/comment-tool/test_AddReferenceInCommentText';

export interface DUTFn { na?: string; st: 0 | 1; msg?: string; expect?: string; actual?: string; error?: any }
export interface DUTClass { na: string; fns: DUTFn[]; }
@Component({
  selector: 'app-qunits',
  templateUrl: './qunits.component.html',
  styleUrls: ['./qunits.component.css'],
})
export class QunitsComponent implements OnInit {
  datas: DUTClass[] = [];
  constructor() { }
  ngOnInit() {
    UT.add(test_newLineNewLineSplit);
    UT.add(test_mergeTextAtCommentText);
    UT.add(test_addListStartAndEndUnitTests);
    UT.add(test_prepareDataForAddOrderAndListAtComment);
    UT.add(test_AddReferenceInCommentText);
    UT.testAsync().then(re => this.datas = re);
  }
}


