import * as LQ from 'linq';
import { deepCopy } from 'src/app/tools/deepCopy';
import { DText } from './../../bible-text-convertor/AddBase';
import { DAddress } from 'src/app/bible-address/DAddress';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
/**
 * 與一般的 AddReference 不一樣, 在於 注釋 中的 reference, 很多省略了 書卷名, 例如
 * 引言 ( #1:1-17| ), 所以會傳入 addrSet 作為「若沒有傳入的預設值」
 * 通常接在 Comment2DText 之後使用
 */
export class AddReferenceInCommentText {
  main(datas: DText[], addrSet: DAddress) {
    // console.log(...datas);

    let re = testEachLine(datas);
    re = connectComma(re);
    re = setRefScriptation(re, addrSet);
    return re;
    function testEachLine(arg: DText[]) {
      const rre: DText[] = [];
      for (const arg1 of arg) {
        if (arg1.w === undefined || arg1.w.length === 0) {
          rre.push(arg1);
          continue;
        }
        const rr1 = new SplitStringByRegexVer2().main(arg1.w, /#[^|]+\|/g);
        for (const it1 of rr1) {
          const r2 = deepCopy(arg1);
          if (it1.exec === undefined) {
            r2.w = it1.w;
            rre.push(r2);
          } else {
            r2.w = it1.w;
            r2.isRef = 1;
            rre.push(r2);
          }
        }
      }
      return rre;
    }
    function connectComma(arg: DText[]) {
      // console.log(...arg);
      const idxRemove = [];
      LQ.range(0, arg.length - 2).reverse().forEach(i1 => {
        const cur = arg[i1];
        const nt = arg[i1 + 1];
        const ntnt = arg[i1 + 2];
        if (cur.isRef === 1 && ntnt.isRef === 1 && ['、', ' '].includes(nt.w)) {
          cur.w += nt.w + ntnt.w;
          nt.w = ''; ntnt.w = '';
          idxRemove.push(i1 + 2);
          idxRemove.push(i1 + 1);
        }
      });
      idxRemove.forEach(a1 => arg.splice(a1, 1));
      // console.log(...arg);
      return arg;
    }
    function setRefScriptation(arg: DText[], addr: DAddress) {
      LQ.from(arg).where(a1 => a1.isRef === 1).forEach(a1 => {
        try {
          const rr2 = a1.w.replace(/#|\|/g, '');
          const rr1 = rr2.split(/、/);
          const rr3 = rr1.join(';');
          const rr4 = VerseRange.fD(rr3, addr.book);
          a1.refDescription = DisplayLangSetting.s.getValueIsGB()? rr4.toStringChineseGBShort() : rr4.toStringChineseShort();
        } catch (error) {
          // 創3:20注釋, #以諾書 71:7|
          delete a1.isRef;
          delete a1.refDescription;
        }
      });
      return arg;

    }
  }

}

