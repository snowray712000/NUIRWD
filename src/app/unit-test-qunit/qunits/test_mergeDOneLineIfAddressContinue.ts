import * as LQ from 'linq';
import { UT } from './UT';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { mergeDOneLineIfAddressContinue } from "src/app/bible-text-convertor/mergeDOneLineIfAddressContinue";
import { VerseRange } from 'src/app/bible-address/VerseRange';
export async function test_mergeDOneLineIfAddressContinue() {
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
        { children: [{ w: 'a' }, { w: 'b' }], addresses: VerseRange.fD('創1:31-2:1') }
      ];
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
