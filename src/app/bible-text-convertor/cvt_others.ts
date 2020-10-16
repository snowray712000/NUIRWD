import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import { VerseRange } from '../bible-address/VerseRange';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { deepCopy } from '../tools/deepCopy';
import { AddReferenceInCommentText } from '../side-nav-right/comment-tool/AddReferenceInCommentText';

/**
 * 開發，是以 和合本2010 去作的
*/

export function cvt_others(data: DOneLine[], verses: VerseRange, ver?: string) {
  data = new AddMergeVerse().main(data, verses);

  let re1: DOneLine[] = [];
  for (let i1 = 0; i1 < data.length; i1++) {
    const it1 = data[i1];
    const r1 = cvt_oneLine(it1);
    re1.push(r1);
  }

  return re1;
  function cvt_oneLine(it1: DOneLine) {

    it1 = replaceNewLineToBr(it1);
    it1 = replaceOrigToPair(it1);
    if (ver === 'kjv') replaceKJVToPair(it1);
    it1 = addParentheses(it1);
    it1 = doUsingDOMParsor(it1);
    it1 = addReference(it1);

    return it1;
    /** KJV 以 FI 為例，它是 FI Fi 而非 FI /FI 成對 */
    function replaceKJVToPair(it1) {
      for (const it2 of it1.children) {
        if (it2.w !== undefined && isIncludeRef(it2.w)) {
          // KJV 不是寫 <FI> </FI> 而是 <FI><Fi> 透過大小寫, RF
          // CM 不是成對的
          it2.w = it2.w.replace(/(<Fi>)|(<Rf>)|(<CM>)/g, (a1, a2, a3, a4) => {
            if (a3 != null) return '</RF>';
            if (a2 != null) return '</FI>';
            if (a4 != null) return '<CM/>';
          });
        }
      }
      return;
      function isIncludeRef(str: string): boolean {
        return /<Fi>|<Rf>|<CM>/.test(str); // #路1|        
      }
    }
    /** 交互參照 */
    function addReference(it1: DOneLine): DOneLine {
      toStandard();

      const re1 = new AddReferenceInCommentText().main(
        it1.children, it1.addresses.verses[0]);
      return { children: re1, addresses: it1.addresses, ver: it1.ver };

      /** 讓參考形如 路:1-2 */
      function toStandard() {
        for (const it2 of it1.children) {
          if (it2.w !== undefined && isIncludeRef(it2.w)) {
            // 全型：、點(和合本2010)． ,,, 要換回標準 : 
            it2.w = it2.w.replace(/(\d+)(?:．|：)(\d+)/g, (a1, a2, a3) => {
              return `${a2}:${a3}`;
            });
          }
        }
        return;

        function isIncludeRef(str: string): boolean {
          return /#[^\|]+\|/.test(str); // #路1|        
        }
      }
    }
    /** 小括號
     * 雖然直覺，小括號是要在 title 裡面。
     * 但目前程式，(在 rendor 部分, 它們是平行的, 繪圖都是 isTitle1 與 isParentheses)
     */
    function addParentheses(it1: DOneLine): DOneLine {
      return new AddParenthesesUnvNcv().mainDoOne(it1);
    }
    /** 包含了 h2 h3 u b SN */
    function doUsingDOMParsor(it1: DOneLine): DOneLine {
      const re2: DText[] = [];
      for (const it2 of it1.children) {
        if (it2.w !== undefined) {
          let re3 = getAllDTextsFromAllChildrenNode(it2.w, it2);
          for (const it3 of re3)
            re2.push(it3);
        } else
          re2.push(it2);
      }
      return { children: re2, ver: it1.ver, addresses: it1.addresses };
    }
    /**
     * 要 recursive 呼叫
     * parentDText 是當被 h2 包住的東西，傳入供 child copy
     * */
    function getAllDTextsFromAllChildrenNode(
      strInnerHTML: string, parentDText?: DText) {
      let rr3 = parsingToDOMs(strInnerHTML);

      const re: DText[] = [];
      for (let i3 = 0; i3 < rr3.length; i3++) {
        let rrr1: DText = parentDText === undefined ? {} : deepCopy(parentDText);
        const it3 = rr3[i3] as HTMLElement;
        if (it3.nodeType === 1 && /^H\d$/.test(it3.tagName)) {
          rrr1.isTitle1 = 1; // h2 h3
          let rrr2 = getAllDTextsFromAllChildrenNode(it3.innerHTML, rrr1);
          for (const it4 of rrr2)
            re.push(it4);
        } else if (it3.nodeType === 1 && /^B$/.test(it3.tagName)) {
          rrr1.isBold = 1; // b
          let rrr2 = getAllDTextsFromAllChildrenNode(it3.innerHTML, rrr1);
          for (const it4 of rrr2)
            re.push(it4);
        } else {
          if (it3.nodeType === 3) rrr1.w = it3.textContent; // text
          else if (it3.nodeType === 1 && it3.tagName === 'BR') {
            delete rrr1.w; rrr1.isBr = 1;
          } else if (it3.nodeType === 1 && it3.tagName === 'U') {
            rrr1.isName = 1; rrr1.w = it3.textContent;
          } else if (it3.nodeType === 1 && it3.tagName === 'FI') {
            rrr1.isBold = 1; rrr1.w = it3.textContent; // KJV 未知
          } else if (it3.nodeType === 1 && it3.tagName === 'RF') {
            rrr1.isBold = 1; rrr1.w = it3.textContent; // KJV 未知
          } else if (it3.nodeType === 1 && it3.tagName === 'CM') {
            rrr1.isBold = 1; rrr1.w = it3.textContent; // KJV 未知
          } else if (/WA?(T?)(H|G)(\d+[a-z]?)(I?)/.test(it3.tagName)) {
            let rr1 = /WA?(T?)(H|G)(\d+[a-z]?)(I?)/.exec(it3.tagName);
            const isT = rr1[1].length !== 0;
            rrr1.tp = rr1[2] as 'G' | 'H';
            let sn = rr1[3]; 
            sn = sn.replace(/^0+/,''); // 讓 08521a 變為 8521a
            rrr1.sn = sn
            if (rr1[4].length !== 0)
              rrr1.isCurly = 1;

            rrr1.w = `${rrr1.tp}${rrr1.sn}`;
            if (isT)
              rrr1.w = '(' + rrr1.w + ')';
            else
              rrr1.w = '<' + rrr1.w + '>';
            if (rrr1.isCurly === 1)
              rrr1.w = '{' + rrr1.w + '}';
          } 
          else
            rrr1.w = it3.outerHTML;
          re.push(rrr1);
        }
      }

      return re;
    }
  }

  function parsingToDOMs(str: string) {
    let r1 = new DOMParser().parseFromString(str, 'text/html') as Document;
    return r1.querySelector('body').childNodes;
  }

  /** 在DOMParsor 之前, 原文 <WTH592> 會導致錯誤，因此，要先變為一對 </WTH592> */
  function replaceOrigToPair(it1: DOneLine) {
    for (const it2 of it1.children) {
      if (it2.w !== undefined)
        it2.w = letOrigCanDOMParsed(it2.w);
    }
    return it1;

    /** 原文 <WTH0834> 會使 DOMParser 錯誤。 */
    function letOrigCanDOMParsed(str: string) {
      //let r3 = '<h2>真福<br/></h2>{<WH0834>}不從<WH01980><WTH8804>'
      const r3 = str
        .replace(/{<(WA?T?(?:H|G)\d+[a-z]?)>}|<(WA?T?(?:H|G)\d+[a-z]?)>/gi,
          (a1, a2, a3) => {
            if (a2 != null) {
              return `<${a2}I></${a2}I>`; // 尾部加個 I 好了, ignore 的 i. 


              // 花括號, 不行變 <{WH834}> 因為,若是recursive 時 innerHTML 會錯.
              // return `<{${a2}}></{${a2}}>`; 
            } else if (a3 != null) {
              return `<${a3}></${a3}>`;
            }
            return a1;
          });
      return r3;
    }
  }
  /** 一定要在 title 前 */
  function replaceNewLineToBr(it1: DOneLine) {
    for (const it2 of it1.children) {
      if (it2.w !== undefined) {
        it2.w = it2.w.replace(/\r?\n/g, '<br/>');
      }
    }
    return it1;
  }
}
