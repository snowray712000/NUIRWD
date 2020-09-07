import { UT } from './UT';
import { OrigStwcbDOMParsor } from 'src/app/fhl-api/Orig/OrigStwcbDOMParsor';
export async function test_OrigStwcbDOMParsor() {
  const console = { isDebug: false, log(a1) { if (console.isDebug) { globalThis.console.log(a1); } }, error(a1) { globalThis.console.error(a1); }, warn(a1) { globalThis.console.warn(a1); } };
  console.isDebug = false;
  const equal = UT.equal;

  return UT.gFnSafe(fns => {
    test01();
    test02();
    test03();
    test04();
    test05a(); test05b();
    return;
    function test01() {
      const dst = new OrigStwcbDOMParsor().main('abc\ndef');
      const dstExcept = [{ w: 'abc\ndef' }];
      fns.push(equal('01.純文字時', dstExcept, dst));
    }
    function test02() {
      const dst = new OrigStwcbDOMParsor().main('abc<span>def</span>ghi');
      const dstExcept = [{ w: 'abc' }, { w: 'def' }, { w: 'ghi' }];
      fns.push(equal('02.一層', dstExcept, dst));
    }
    function test03() {
      const dst = new OrigStwcbDOMParsor().main('a<div>b<span>c</span>d</div>e');
      const dstExcept = [{ w: 'a' }, { w: 'b' }, { w: 'c' }, { w: 'd' }, { w: 'e' }];
      fns.push(equal('03.二層', dstExcept, dst));
    }
    function test04() {
      const dst = new OrigStwcbDOMParsor().main('a<div class="f">b<span class="g">c</span>d</div>e');
      const dstExcept = [{ w: 'a' }, { w: 'b', class: 'f' }, { w: 'c', class: 'g f' }, { w: 'd', class: 'f' }, { w: 'e' }];
      fns.push(equal('04.二層含class', dstExcept, dst));
    }
    function test05a() {
      const dst = new OrigStwcbDOMParsor().main('a<br/>b');
      const dstExcept = [{ w: 'a' }, { isBr: 1 }, { w: 'b' }];
      fns.push(equal('05a. br換行', dstExcept, dst));
    }
    function test05b() {
      const dst = new OrigStwcbDOMParsor().main('a<hr/>b');
      const dstExcept = [{ w: 'a' }, { isHr: 1 }, { w: 'b' }];
      fns.push(equal('05b. hr換行', dstExcept, dst));
    }
  });
}
