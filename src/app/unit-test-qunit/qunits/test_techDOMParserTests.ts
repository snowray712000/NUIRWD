import * as LQ from 'linq';
import { UT } from './UT';
export async function test_techDOMParserTests() {
  const console = { isDebug: true, log: a1 => { if (console.isDebug) { globalThis.console.log(a1); } } };
  console.isDebug = false;

  return UT.gFnSafe(fns => {
    // 01. 基本呼叫
    const r1 = new DOMParser().parseFromString(
      '123<span class="abc">456<hr/><br/></span>789',
      'text/html') as Document;
    console.log(r1);

    // 02. 使用 - 取得某層
    const r2 = r1.querySelector('body') as HTMLBodyElement;
    console.log(r2);
    // children 與 child nodes 差異
    console.log(r2.children);
    console.log(r2.childNodes);

    // 03. 使用 - 取得 class (nodeType,as HTMLElement, getAttribute)
    const r3 = LQ.from(r2.childNodes).select(a1 => {
      // a1 as ChildNode
      if (a1.nodeType === 3) {
        return ''; // text
      }
      // a1.nodeType == 1 ;
      const a2 = a1 as HTMLElement;
      return a2.getAttribute('class');
    }).toArray();
    console.log(r3);

    // 04. recursive 取得所有
    const r4 = getAllNodes(r1.querySelector('body'));
    console.log(r4);

    return;
    function getAllNodes(body: HTMLBodyElement) {
      const rr1 = getNodes(body as ChildNode);
      return rr1;

      function getNodes(arg1: ChildNode): any[] {
        if (arg1.nodeType === 3) {
          return [arg1];
        } else {
          const rr2 = LQ.from(arg1.childNodes).select(a1 => getNodes(a1)).toArray();
          const rr3 = [];
          const rr4 = arg1 as HTMLElement; // 取得 class 之類的
          for (const it2 of rr2) {
            for (const it3 of it2) {
              rr3.push(it3);
            }
          }
          return rr3;
        }
      }
    }

  }, 'test_techDOMParserTests exception');
}
