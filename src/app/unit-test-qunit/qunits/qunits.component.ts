import { DAddress, DAddressComparor } from 'src/app/bible-address/DAddress';
import Enumerable from 'linq';
import { Component, OnInit } from '@angular/core';
import { UT } from './UT';
import { test_newLineNewLineSplit } from './test_newLineNewLineSplit';
import { test_mergeTextAtCommentText } from './test_mergeTextAtCommentText';
import { test_prepareDataForAddOrderAndListAtComment } from './test_prepareDataForAddOrderAndListAtComment';
import { test_addListStartAndEndUnitTests } from './test_addListStartAndEndUnitTests';

import { DText } from "src/app/bible-text-convertor/DText";
import { test_AddReferenceInCommentText } from 'src/app/side-nav-right/comment-tool/test_AddReferenceInCommentText';
import { test_techDOMParserTests } from './test_techDOMParserTests';
import { merge_nestarray } from 'src/app/tools/merge_nestarray';
import { test_OrigStwcbDOMParsor } from './test_OrigStwcbDOMParsor';
import { test_mergeDOneLineIfAddressContinue } from './test_mergeDOneLineIfAddressContinue';
import { test_mergeDifferentVersionResult } from './test_mergeDifferentVersionResult';
import { test_DAddressComparor } from './test_DAddressComparor';
import { EventTool } from 'src/app/tools/EventTool';

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
    UT.add(test_techDOMParserTests);
    UT.add(test_OrigStwcbDOMParsor);
    UT.add(test_mergeDOneLineIfAddressContinue);
    UT.add(test_DAddressComparor);
    UT.add(test_mergeDifferentVersionResult);

    UT.testAsync().then(re => this.datas = re);
  }
}

async function test_XXXX() {
  const equal = UT.equal;
  return UT.gFnSafe(fns => {
    test01a(); // 1,2 合為 1-2
    return;
    function test01a() {
      const datas: DAddress[] = [
        { book: 40, chap: 1, verse: 1 },
      ];
      const dst = Enumerable.from(datas).distinct(DAddressComparor).toArray();
      const dstExcept: DAddress[] = [
        { book: 40, chap: 1, verse: 1 },
      ];
      fns.push(equal('01a_需要工具 distinct address', dstExcept, dst));
    }
  });
}
