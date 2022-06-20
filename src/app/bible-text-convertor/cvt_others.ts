import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import { VerseRange } from '../bible-address/VerseRange';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { deepCopy } from '../tools/deepCopy';
import { AddReferenceInCommentText } from '../side-nav-right/comment-tool/AddReferenceInCommentText';
import { SplitStringByRegexVer2 } from '../tools/SplitStringByRegex';
import { BibleBookNames } from '../const/book-name/BibleBookNames';
import { BookNameConstants } from '../const/book-name/BookNameConstants';
import * as LQ from 'linq';
import {ReferenceOther} from 'ijn-fhl-sharefun-ts/lib/bible-text/ReferenceOther';
import {ReferenceNcv} from 'ijn-fhl-sharefun-ts/lib/bible-text/ReferenceNcv';
import { DisplayLangSetting } from '../rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { IReferenceTools } from 'ijn-fhl-sharefun-ts/lib/bible-text/IReferenceTools';
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
    if (ver === 'cnet_foot') replaceCnetFootReference(it1);
    if (ver === 'csb_foot') replaceCsbFootReference(it1);
    it1 = doUsingDOMParsor(it1);
    it1 = addParentheses(it1);
    it1 = addReference(it1);
    it1 = addFoot(it1, ver);

    return it1;
    /** 
     * csb(中文標準譯本－新約only) 版本注釋。在 foot dialog 要用到的
     * 太1:23 1:23 《以賽亞書》7:14。
    */
    function replaceCsbFootReference(it1: DOneLine): DOneLine {
      const reg = gRegExp();       // doText() 中用

      for (const it2 of it1.children) {
        doText(it2);
      }

      return it1;
      function doText(it2: DText) {
        if (it2.w === undefined) return;

        let r3 = new SplitStringByRegexVer2().main(it2.w, reg);
        if (r3.length === 1) { return; }

        const re: DText[] = [];
        for (let i3 = r3.length - 1; i3 > -1; i3--) {
          const it3 = r3[i3];
          const r4 = deepCopy(it2);
          r4.w = it3.w;
          if (it3.exec == null) { re.push(r4); continue; }

          // assert ( it3.exec != null )
          if (i3 !== 0 && r3[i3 - 1].exec != null) {
            // [0]: 《以賽亞書》7:14
            // [1]: 以賽亞書
            // [2]: 7:14
            r3[i3 - 1].w += it3.w;
          } else {
            it3.w = it3.w.replace(/[(《)|(》)|(；)]/g, (a1, a2, a3, a4) => {
              if (a2 != null) return '';
              if (a3 != null) return '';
              if (a4 != null) return ';';
            });
            it3.w = '#' + it3.w + '|';
            re.push(it3);
          }
        }
        it2.w = LQ.from(re).select(a1 => a1.w)
          .reverse().toArray().join('');

      }
      function gRegExp() {
        BookNameConstants.CHINESE_BOOK_NAMES
        const str1 = LQ.from(BookNameConstants.CHINESE_BOOK_NAMES)
          .orderByDescending(a1 => a1.length).toArray().join('|');
        const reg1 = new RegExp('《(' + str1 + ')》(\\d+[\\d　 :；;,\\-]*)', 'g');
        // 不行 徒3 因為，奉
        return reg1;
      }
    }
    /** 
     * cnet 版本注釋。在 foot dialog 要用到的
     * 羅1:1 （詩89:3；撒下7:5, 8）
     * 羅1:4 本處和馬太福音28:18同義：
     * 創3:1 例：參啟12:9）  舊約偽經《禧年書》(Jubilees) 3:28如此說：「 （假定是希伯來話，見12:26） 在《猶太古史》(Jewish Antiquities)1.1.4 (1.41)
    */
    function replaceCnetFootReference(it1: DOneLine): DOneLine {
      const reg = gRegExp();       // doText() 中用

      for (const it2 of it1.children) {
        doText(it2);
      }

      return it1;
      function doText(it2: DText) {
        if (it2.w === undefined) return;

        let r3 = new SplitStringByRegexVer2().main(it2.w, reg);
        if (r3.length === 1) { return; }

        const re: DText[] = [];
        for (let i3 = r3.length - 1; i3 > -1; i3--) {
          const it3 = r3[i3];
          const r4 = deepCopy(it2);
          r4.w = it3.w;
          if (it3.exec == null) { re.push(r4); continue; }

          // assert ( it3.exec != null )
          if (i3 !== 0 && r3[i3 - 1].exec != null) {
            r3[i3 - 1].w += it3.w;
          } else {
            it3.w = it3.w.replace(/[( +)|(　+)|(；)]/g, (a1, a2, a3, a4) => {
              if (a2 != null) return '';
              if (a3 != null) return '';
              if (a4 != null) return ';';
            });
            it3.w = '#' + it3.w + '|';
            re.push(it3);
          }
        }
        it2.w = LQ.from(re).select(a1 => a1.w)
          .reverse().toArray().join('');

      }
      function gRegExp() {
        BookNameConstants.CHINESE_BOOK_NAMES
        const str1 = LQ.from(BookNameConstants.CHINESE_BOOK_NAMES)
          .concat(BookNameConstants.CHINESE_BOOK_ABBREVIATIONS)
          .orderByDescending(a1 => a1.length).toArray().join('|');
        const reg1 = new RegExp('(?:' + str1 + ')\\d+[\\d　 :；;,\\-]*', 'g');
        // 不行 徒3 因為，奉
        return reg1;
      }
    }
    /** 注腳。大衛【1】，見 CNET 或是 中文標準譯本 */
    function addFoot(it1: DOneLine, ver: string): DOneLine {
      const re: DText[] = [];
      const addr = it1.addresses.verses[0];

      //const ver = it1.ver;
      //const address = it1.addresses.verses[0];

      let isChanged = false;
      for (const it2 of it1.children) {
        const re2 = doText(it2);
        if (re2.length === 1) re.push(re2[0]);
        else {
          if (isChanged === false) isChanged = true;
          for (const it3 of re2) { re.push(it3); }
        }
      }
      if (isChanged) {
        it1.children = re;
      }
      return it1;
      /** 回傳1個，表示沒有變。 */
      function doText(it2: DText): DText[] {
        if (it2.w === undefined) {
          return [it2];
        }

        const re: DText[] = [];
        if (it2.w !== undefined) {
          const r3 = new SplitStringByRegexVer2().main(it2.w, /【(\d+)】/g);
          if (r3.length === 1) {
            re.push(it2);
          } else {
            if (isChanged === false) {
              isChanged = true;
            }
            for (const it3 of r3) {
              const r4 = deepCopy(it2) as DText;
              r4.w = it3.w;
              if (it3.exec != null) {
                r4.foot = {
                  id: parseInt(it3.exec[1]),
                  version: ver,
                  book: addr.book,
                  chap: addr.chap,
                  verse: addr.verse,
                };
              }
              re.push(r4);
            }
          }
        }
        return re;
      }

    }
    /** KJV 以 FI 為例，它是 FI Fi 而非 FI /FI 成對 */
    function replaceKJVToPair(it1) {
      for (const it2 of it1.children) {
        if (it2.w !== undefined && isIncludeRef(it2.w)) {
          // KJV 不是寫 <FI> </FI> 而是 <FI><Fi> 透過大小寫, RF
          // CM 不是成對的
          it2.w = it2.w.replace(/(<Fi>)|(<Rf>)|(<CM>)|<Fo>/g, (a1, a2, a3, a4, a5) => {
            if (a3 != null) return '</RF>';
            if (a2 != null) return '</FI>';
            if (a4 != null) return '<CM/>';
            if (a5 != null) return '</FO>';
          });
        }
      }
      return;
      function isIncludeRef(str: string): boolean {
        return /<Fi>|<Rf>|<CM>|<Fo>/.test(str); // #路1|        
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
        const isGb = DisplayLangSetting.s.getValueIsGB()? 1: undefined;
        for (const it2 of it1.children) {        
          // 新譯本特別處理
          const refTool:IReferenceTools = 
          ver === 'ncv' ? new ReferenceNcv(it2.w,isGb) : new ReferenceOther(it2.w,isGb);
          if (refTool.isIncludeRef()){
            it2.w = refTool.toStandard();            
          }
        }
        return;
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
        } else if (it3.nodeType === 1 && /^FO$/.test(it3.tagName)) {
          rrr1.isTitle1 = 1; // b
          let rrr2 = getAllDTextsFromAllChildrenNode(it3.innerHTML, rrr1);
          for (const it4 of rrr2)
            re.push(it4);
        } else if (it3.nodeType === 1 && it3.tagName === 'SPAN' && it3.style !== undefined && it3.style.color !== '') {          
          rrr1.w = it3.textContent; rrr1.cssColor = it3.style.color; // 路 7:33 紅字中有私名號 
          let rrr2 = getAllDTextsFromAllChildrenNode(it3.innerHTML, rrr1);
          for (const it4 of rrr2)
            re.push(it4);
        }
        else {
          if (it3.nodeType === 3) { rrr1.w = it3.textContent; } // text          
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
          } else if (/WA?(T?)(H|G)(\d+[aA]?)(I?)/.test(it3.tagName)) {
            let rr1 = /WA?(T?)(H|G)(\d+[aA]?)(I?)/.exec(it3.tagName);            
            const isT = rr1[1].length !== 0;
            rrr1.tp = rr1[2] as 'G' | 'H';
            let sn = rr1[3];
            sn = sn.replace(/^0+/, '').toLocaleLowerCase(); // 讓 08521a 變為 8521a ... tagName 會自動變全大寫，所以造成 8521A 就會抓錯資料
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
