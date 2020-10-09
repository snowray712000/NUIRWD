import { AddBrStdandard } from 'src/app/version-parellel/one-ver/AddBrStdandard';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import * as LQ from 'linq';
import { AddReferenceFromOrigDictCBOLChineseText } from "src/app/version-parellel/one-ver/AddReferenceFromOrigDictCBOLChineseText";
import { DText } from 'src/app/bible-text-convertor/AddBase';
import { newLineNewLineSplit } from './newLineNewLineSplit';
import { newLineNewLineMerge } from "./newLineNewLineMerge";
import { addListStartAndEnd } from '../dtexts-rendor/addListStartAndEnd';
/** 將 cvtNewChinese cvtNewEng cvtOldChinese cvtOldEng 整理, 因為它們 code 很多相同的地方 */


export class CBOL2DTextConvertor {
  private isOld: number; // main 時會更新
  private isChinese: number; // main 時會更新

  main(arg: { str: string; isOld?: 0 | 1; isChinese?: 0 | 1; }): DText[] {
    this.isOld = arg.isOld;
    this.isChinese = arg.isChinese;
    // 先 copy 最原版, 新約中文
    let r3: DText[] = [{ w: arg.str }];
    r3 = new AddBrStdandard().main2(r3);

    interface DataWithType { data: DText[]; tp: 'title' | 'orig' | 'AV' | 'TDNT' | 'TWOT' | 'unknown' | '同義字'; }
    const reClassified = splitToPart(r3);
    const reCvtors = LQ.from(reClassified).select(a1 => cvtEachType(a1)).toArray();
    const re = newLineNewLineMerge(reCvtors);
    return re;



    function splitToPart(data: DText[]): DataWithType[] {
      // 'title': 5203 hudropikos {hoo-dro-pik-os'}
      // 'orig': 源自 5204 與 3700 衍生字的複合 (看起來水水的); 形容詞
      // 'AV' : 欽定本 - (AV - ) .... son(s) 85, Son of Man + 444 87 {TDNT 8:400, 1210}, ...
      // 'TDNT' : TDNT - 8:314,1203; 中性名詞 (很少出現...一般就是 orig 的後半部出現 TDNT)
      // 'TWOT' : TWOT - 2c;陽性名詞, (舊約才會有的)
      // 'unknown' :
      // '同義字' : 同義字請見 5868 ... G67 有關希律的討論, 見 2264

      const reGroupNewLineNewLine = newLineNewLineSplit(data);
      const reClassify = classify(reGroupNewLineNewLine) as DataWithType[];
      return reClassify;

      function classify(group: DText[][]): DataWithType[] {
        return LQ.from(group).select((a1, i1) => {
          if (i1 === 0) {
            return { data: a1, tp: 'title' };
          } else if (i1 === 1) {
            return { data: a1, tp: 'orig' };
          } else if (isAV(a1)) {
            return { data: a1, tp: 'AV' };
          } else if (isTDNT(a1)) {
            return { data: a1, tp: 'TDNT' };
          } else if (isTWOT(a1)) {
            return { data: a1, tp: 'TWOT' };
          } else if (is同義字(a1)) {
            return { data: a1, tp: '同義字' };
          } else {
            return { data: a1, tp: 'unknown' };
          }
        }).toArray() as DataWithType[];
        return;
        function isAV(a1: DText[]) {
          return /^\s*AV ?-|^欽定本 ?-/i.test(a1[0].w);
        }
        function isTDNT(a1: DText[]) {
          return /^\s*TDNT ?-/i.test(a1[0].w);
        }
        function isTWOT(a1: DText[]) {
          return /^\s*TWOT ?-/i.test(a1[0].w);
        }
        function is同義字(a1: DText[]) {
          return /^\s*同義字|見\s*(?:\d+[a-z]?)/i.test(a1[0].w);
        }
      }


    }
    function cvtEachType(dataAndTp: DataWithType): DText[] {
      switch (dataAndTp.tp) {
        case 'title': return cvtTitle(dataAndTp.data);
        case 'orig': return cvtOrig(dataAndTp.data);
        case 'AV': return cvtAV(dataAndTp.data);
        case 'TDNT': return cvtTDNT(dataAndTp.data);
        case '同義字': return cvtSynonyms(dataAndTp.data);
        default: return cvtUnknown(dataAndTp.data);
      }

      function cvtTitle(datas: DText[]) {
        if (datas.length === 1) {
          return datas;
        }
        return [{
          w: LQ.from(datas).select(a1 => a1.w).toArray().join('')
        }];
      }
      function cvtOrig(datas: DText[]) {
        const str = LQ.from(datas).select(a1 => a1.w).merge().toArray().join('');
        const str2 = str.split(';');
        return LQ.from(getBefore(str2[0])).concat(getAfter()).toArray();

        function getBefore(strBefore: string): DText[] {
          const rrr1 = new SplitStringByRegexVer2().main(strBefore, /(?:SN)?(H|G)?(\d+[a-z]?)/gi);
          return LQ.from(rrr1).select(a1 => {
            if (a1.exec == null) {
              return { w: a1.w } as DText;
            }
            let isOld = arg.isOld === 1;
            if (/希伯來文|亞蘭文|Aramaic|Hebrew/i.test(strBefore)) {
              isOld = true;
            }
            if (a1.exec[1] != null) {
              isOld = /H/i.test(a1.exec[1]);
            }
            return {
              w: (isOld ? 'H' : 'G') + a1.exec[2],
              sn: a1.exec[2],
              tp: isOld ? 'H' : 'G',
            } as DText;
          }).toArray();
        }
        function getAfter() {
          if (str2.length === 1) {
            return []; // 沒分號
          }
          return [{ w: ';' + str2[1] }];
        }
      }
      function cvtSynonyms(datas: DText[]) {
        return cvtOrig(datas);
      }
      function cvtAV(datas: DText[]) {
        const str = LQ.from(datas).select(a1 => a1.w).merge().toArray().join('');
        return [{ w: str }];
      }
      function cvtTDNT(datas: DText[]) {
        return cvtAV(datas);
      }
      function cvtUnknown(datas: DText[]) {

        const dataWithTp = datas.map(a1 => checkEachListLevel(a1));
        const dataWithTpConnectedString = connectString(dataWithTp);

        const re2 = addListStartAndEnd(dataWithTpConnectedString);

        const re3 = re2.map(a1 => a1.data);
        return new AddReferenceFromOrigDictCBOLChineseText().main2(re3);

        function checkEachListLevel(a1: DText) {
          const levelMax = 4; // 1a1a)

          // 1) 2) 3) 4)
          // 1a) 1b) 1c) 1d) 1e)
          // 1a1) 1a2) 1a3) 1a4) 1a5)
          // 1a1a) 1a1b)

          // const r1 = /^(\s*)(\d+)\s*\)/i.exec(a1.w); // [1]:'', [2] '1'
          // const r1 = /^(\s*)(\d+)([a-z]?)\s*\)/i.exec(a1.w); // [1]:'', [2] '1'
          // const r1 = /^(\s*)(\d+)([a-z]?)((?:\d+)?)\s*\)/i.exec(a1.w); // [1]:' ', [2] '1' [3]: 'a'
          const r1 = /^(\s*)(\d+)([a-z]?)((?:\d+)?)([a-z]?)\s*\)/i.exec(a1.w); // [1]:' ', [2] '1' [3]: 'a'
          if (r1 == null) {
            const cntSpace = /^\s*/.exec(a1.w)[0].length;
            return { data: a1, list: [], space: cntSpace } as DDataWithLevel;
          } else {
            const levels = getLevels();
            const cntSpace = r1[1].length;
            return { data: a1, list: levels, space: cntSpace };
          }


          /** [1,1,3] 表示 1a3) */
          function getLevels() {
            return LQ.range(2, levelMax).takeWhile(i1 => r1[i1].length !== 0).select(i1 => {
              if (/\d+/.test(r1[i1])) {
                return parseInt(r1[i1], 10);
              }
              // 實驗 console.log('c'.charCodeAt(0) - 'a'.charCodeAt(0)); // 2
              return r1[i1].charCodeAt(0) - 'a'.charCodeAt(0) + 1; // 讓 a 是 1
            }).toArray();
          }

        }
        /** 合併到前一列前, trim前面的空白, 另外, 若上一行結尾沒標點符號, 加上一個'.' */
        function connectString(aa1: DDataWithLevel[]) {
          if (aa1.length === 0) { return []; }
          let cur = aa1[0];
          for (let i1 = 1; i1 < aa1.length; i1++) {
            const it1 = aa1[i1];

            if (it1.list.length === 0) {
              if (cur.list.length === 0) {
                cur = it1; // 還沒開始 list 之前的文字, 維持換行, 不合併
              } else {
                if (isNeedAddChar(cur.data.w)) {
                  cur.data.w += '.';
                }
                if (it1.data.w !== undefined) {
                  cur.data.w += it1.data.w.trim();
                }
                aa1.splice(i1, 1);
                i1--; // 在 for loop 會 ++
              }
            } else {
              cur = it1;
            }
          }
          return aa1;
          function isNeedAddChar(strPreLine: string) {
            return false === /(?:,|.|，|。|;|-)$/i.test(strPreLine);
          }
        }
      }
    }
  }

}

interface DDataWithLevel { data: DText; list?: number[]; space?: number; tp?: string; }
