import { UT } from './UT';
import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { mergeDifferentVersionResult } from "src/app/version-interlace/mergeDifferentVersionResult";
import { VerseRange } from 'src/app/bible-address/VerseRange';
export async function test_mergeDifferentVersionResult() {
  const equal = UT.equal;
  return UT.gFnSafe(fns => {
    test01a(); //
    test02a(); // 有合併節
    test02b(); // 有合併節
    test03(); // 3 版本
    test03b(); // 1 版本
    test04(); // 有 error 時
    test04b(); // 有 error 時
    return;
    function test01a() {
      const datas: DOneLine[][] = [
        [{ children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') }],
        [{ children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') }]
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-2'));
      const dstExcept: DOneLine[] = [{ children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
      { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
      { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
      { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') }];
      fns.push(equal('01a_基本概念.', dstExcept, dst));
    }

    function test02a() {
      const datas: DOneLine[][] = [
        [{ children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1-2') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:3') }],
        [{ children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'bb3.' }], ver: 'ver b', addresses: VerseRange.fD('創1:3') },]
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-3'));
      const dstExcept: DOneLine[] = [{ children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1-2') },
      { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
      { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') },
      { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:3') },
      { children: [{ w: 'bb3.' }], ver: 'ver b', addresses: VerseRange.fD('創1:3') },];
      fns.push(equal('02a_具合併節.', dstExcept, dst));
    }
    function test02b() {
      const datas: DOneLine[][] = [
        [
          { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
          { children: [{ w: 'aa3.' }], ver: 'ver a', addresses: VerseRange.fD('創1:3') },
        ],
        [
          { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1-2') },
          { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:3') },
        ]
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-3'));
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1-2') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'aa3.' }], ver: 'ver a', addresses: VerseRange.fD('創1:3') },
        { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:3') },
      ];
      fns.push(equal('02b_具合併節.', dstExcept, dst));
    }
    function test03() {
      const datas: DOneLine[][] = [
        [
          { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
        ],
        [
          { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') },
        ],
        [
          { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
        ],
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-2'));
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'bb1.' }], ver: 'ver b', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'bb2.' }], ver: 'ver b', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
      ];
      fns.push(equal('03b_兩個版本以上', dstExcept, dst));
    }
    function test03b() {
      const datas: DOneLine[][] = [
        [{ children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') }],
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-2'));
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
      ];
      fns.push(equal('01a_一個版本', dstExcept, dst));
    }
    function test04() {
      const datas: DOneLine[][] = [
        [
          { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
        ],
        [
          { children: [{ w: 'Qsb API Error.' }], ver: 'ver b', },
        ],
        [
          { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
        ],
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-2'));
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'aa1.' }], ver: 'ver a', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'aa2.' }], ver: 'ver a', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'Qsb API Error.' }], ver: 'ver b', },
      ];
      fns.push(equal('04a_有Error', dstExcept, dst));
    }
    function test04b() {
      const datas: DOneLine[][] = [
        [
          { children: [{ w: 'Qsb API Error.' }], ver: 'ver a', },
        ],
        [
          { children: [{ w: 'Qsb API Error.' }], ver: 'ver b', },
        ],
        [
          { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
          { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
        ],
      ];
      const dst = mergeDifferentVersionResult(datas,VerseRange.fD('創1:1-2'));
      const dstExcept: DOneLine[] = [
        { children: [{ w: 'cc1.' }], ver: 'ver c', addresses: VerseRange.fD('創1:1') },
        { children: [{ w: 'cc2.' }], ver: 'ver c', addresses: VerseRange.fD('創1:2') },
        { children: [{ w: 'Qsb API Error.' }], ver: 'ver a', },
        { children: [{ w: 'Qsb API Error.' }], ver: 'ver b', },
      ];
      fns.push(equal('04b_有2個Error', dstExcept, dst));
    }
  });
}
