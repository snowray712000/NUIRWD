import * as LQ from 'linq';
import { Component, OnInit } from '@angular/core';
import { UT } from './UT';
import { test_newLineNewLineSplit } from './test_newLineNewLineSplit';
import { test_mergeTextAtCommentText } from './test_mergeTextAtCommentText';
import { test_prepareDataForAddOrderAndListAtComment } from './test_prepareDataForAddOrderAndListAtComment';
import { test_addListStartAndEndUnitTests } from './test_addListStartAndEndUnitTests';

import { DText, DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { mergeDOneLineIfAddressContinue } from "src/app/bible-text-convertor/mergeDOneLineIfAddressContinue";
import { test_AddReferenceInCommentText } from 'src/app/side-nav-right/comment-tool/test_AddReferenceInCommentText';
import { test_techDOMParserTests } from './test_techDOMParserTests';
import { merge_nestarray } from 'src/app/tools/merge_nestarray';
import { test_OrigStwcbDOMParsor } from './test_OrigStwcbDOMParsor';
import { VerseRange } from 'src/app/bible-address/VerseRange';

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
    UT.testAsync().then(re => this.datas = re);
  }
}
async function test_mergeDOneLineIfAddressContinue() {
  const console = { isDebug: true, log: a1 => { if (console.isDebug) { globalThis.console.log(a1); } } };
  console.isDebug = true;
  const equal = UT.equal;

  return UT.gFnSafe(fns => {
    test01(); // 1,2 合為 1-2
    test01a(); // 1,2,3,5,6 合為 1-3,5-6
    test02(); // 跨章
    test03(); // 順序不變
    test04a(); // 不同版本不合
    test04b();
    test04c();
    test05();
    return;
    function test01() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:2') },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }, { w: 'b' }], addresses: VerseRange.fD('創1:1-2') }
      ];
      fns.push(equal('01', dstExcept, dst));
    }
    function test01a() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'c' }], addresses: VerseRange.fD('創1:3') },
        { children: [{ w: 'e' }], addresses: VerseRange.fD('創1:5') },
        { children: [{ w: 'f' }], addresses: VerseRange.fD('創1:6') },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }, { w: 'b' }, { w: 'c' }], addresses: VerseRange.fD('創1:1-3') },
        { children: [{ w: 'e' }, { w: 'f' }], addresses: VerseRange.fD('創1:5-6') }
      ];
      LQ.range(0, 1);
      fns.push(equal('01a', dstExcept, dst));
    }
    function test02() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:31') },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創2:1') },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }, { w: 'b' }], addresses: VerseRange.fD('創1:31-2:1') }];
      fns.push(equal('02', dstExcept, dst));
    }
    function test03() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創2:1') },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:31') },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創2:1') },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:31') },
      ];

      fns.push(equal('03 順序不變', dstExcept, dst));
    }
    function test04a() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '新譯本' },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '新譯本' },
      ];
      fns.push(equal('04 多版本', dstExcept, dst));
    }
    function test04b() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:2'), ver: '和合本' },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }, { w: 'b' }], addresses: VerseRange.fD('創1:1-2'), ver: '和合本' },
      ];
      fns.push(equal('04 同版本', dstExcept, dst));
    }
    function test04c() {
      const datas: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:2'), ver: '新譯本' },
      ];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'a' }], addresses: VerseRange.fD('創1:1'), ver: '和合本' },
        { children: [{ w: 'b' }], addresses: VerseRange.fD('創1:2'), ver: '新譯本' },
      ];
      fns.push(equal('04 同版本', dstExcept, dst));
    }
    function test05() {
      const datas: DOneLine[] = [];
      const dst = mergeDOneLineIfAddressContinue(datas);
      const dstExcept: DOneLine[] = [];
      fns.push(equal('05 空值', dstExcept, dst));
    }

  });
}
