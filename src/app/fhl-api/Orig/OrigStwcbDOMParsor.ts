import { DText } from './../../bible-text-convertor/AddBase';
import Enumerable from 'linq';
import { merge_nestarray } from 'src/app/tools/merge_nestarray';

export class OrigStwcbDOMParsor {

  main(html: string): DText[] {
    return this.commentStwcb(html);
  }
  commentStwcb(html: string) {
    const console = { isDebug: true, log: a1 => { if (console.isDebug) { globalThis.console.log(a1); } }, error: a1 => globalThis.console.error(a1), };
    console.isDebug = false;
    console.log(html);

    const r1 = new DOMParser().parseFromString(html, 'text/html');
    console.log(r1);

    const r2 = r1.querySelector('body');
    console.log(r2);

    const r3 = getAllChildren(r2);
    return r3;

    function getAllChildren(a1: ChildNode): DText[] {
      if (isLeafNoChildren(a1)) {
        if (a1.nodeType === 3) {
          return [{ w: a1.textContent } as DText];
        } else if (/BR/.test(a1.nodeName)) {
          return [{ isBr: 1 } as DText];
        } else if (/HR/.test(a1.nodeName)) {
          return [{ isHr: 1 } as DText];
        }
        globalThis.console.error('impossible:');
        console.error(a1);
        return [];
      } else {
        const rr2 = a1 as HTMLElement;
        const rr3 = rr2.getAttribute('class'); // maybe null
        const r4 = Enumerable.from(a1.childNodes).select(aa1 => {
          const rr4 = getAllChildren(aa1);
          Enumerable.from(rr4).forEach((aaa1: DText) => tryAddClass(aaa1, rr3));
          return rr4;
        }).toArray();
        return merge_nestarray(r4);
      }
    }
  }
}
function isLeafNoChildren(a1: ChildNode) {
  return a1.nodeType === 3 || /HR|BR/.test(a1.nodeName);
}
function tryAddClass(a1: DText, strClass: string) {
  // getAttribute('class') 若不存在, 是回傳 null
  if (strClass !== null) {
    if (a1.class === undefined) {
      a1.class = strClass;
    } else {
      a1.class += ' ' + strClass;
    }
  }
}
