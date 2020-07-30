import { IAddBase, DOneLine, DText } from '../../bible-text-convertor/AddBase';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { deepCopy } from 'src/app/tools/deepCopy';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { first } from 'rxjs/operators';
import { linq_first } from 'src/app/linq-like/linq_first';

export class AddReferenceCnv implements IAddBase {
  private static reg1: RegExp;
  static reg2: RegExp;
  constructor() { }
  main(lines: DOneLine[], verses: VerseRange): DOneLine[] {
    const re: DOneLine[] = [];
    let isExistChange = false;

    for (const it1 of lines) {
      const re1: DText[] = [];
      for (const it2 of it1.children) {
        // 新譯本的 Reference 只會出現在 括號內
        if (it2.isParenthesesFW === undefined) {
          re1.push(it2);
          continue;
        }




        if (AddReferenceCnv.reg1 === undefined) {
          // reg1
          // tslint:disable-next-line: max-line-length
          // const rr4 = new SplitStringByRegexVer2().main(it2.w, /(?:(?:參?(?:太|路|約|撒下)?\d+:\d+(?:~(?:\d+:)?\d+)?(?:；|，|。)?)|(?:參?(?:撒下|詩)\d+))+/g);
          // console.log(rr4);

          // reg2
          // const test1 = '詩53;30:12;57:8;108:1;撒下22:1-51;太26:6-13;約12:1-8;路7:36-50';
          // const r1 = new SplitStringByRegexVer2()
          // .main(test1, /(詩|撒下|太|約|路)?(\d+:\d+-(?:\d+:)?\d+)/g); // Code 留著，看發展過程，提高可讀性
          // .main(test1, /(詩|撒下|太|約|路)?(\d+:\d+-(?:\d+:)?\d+)|(詩|撒下|太|約|路)\d+/g);
          // .main(test1, /(詩|撒下|太|約|路)?(\d+:\d+(?:-(?:\d+:)?\d+)?)|(詩|撒下|太|約|路)\d+/g);
          this.generateRegex();
        }

        const reg1 = AddReferenceCnv.reg1;
        const r3 = new SplitStringByRegexVer2().main(it2.w, reg1);
        for (const it3 of r3) {
          const r2 = deepCopy(it2);
          if (it3.exec === undefined) {
            r2.w = it3.w;
            re1.push(r2);
          } else {
            r2.w = it3.exec[0];
            r2.isRef = 1;
            r2.refDescription = this.cvtDescription(it3.exec[0], it1.addresses);
            re1.push(r2);
            isExistChange = true;
          }
        }
      }
      re.push({ addresses: it1.addresses, children: re1 });
    }

    return isExistChange ? re : lines;
  }

  private cvtDescription(str: string, addrs: VerseRange) {
    str = str.replace(/參/g, '');
    str = str.replace(/；|，|。/g, ';');
    str = str.replace(/~/g, '-');

    // 沒有書卷的, 要在此加 ;
    const na = BibleBookNames.getBookName(linq_first(addrs.verses).book, BookNameLang.太);
    // console.log(str);
    const r2 = new SplitStringByRegexVer2().main(str, AddReferenceCnv.reg2);
    // console.log(r2);
    // 詩50 [2]===null, 50:12 [1]===null,  太50:12 [1]=太 [2]=50:12
    const strs = [];
    for (const it of r2) {
      if (it.exec === undefined || it.exec[2] === undefined || it.exec[1] !== undefined) {
        strs.push(it.w);
      } else {
        strs.push(na + it.exec[2]);
      }
    }

    return strs.join('');
  }
  private generateRegex() {
    // tslint:disable-next-line: no-unused-expression
    // const rr4 = new SplitStringByRegexVer2().main('', /(?:(?:參?(?:太|路|約|撒下)?\d+:\d+(?:~(?:\d+:)?\d+)?(?:；|，|。)?)|(?:撒下|詩)\d+)+/g);

    const r1 = BibleBookNames.getBookNames(BookNameLang.太).join('|');
    // console.log(r1);
    const r2 = `(?:${r1})`;
    // console.log(r2);
    // new RegExp(r2); // test
    const partA = `(?:參?${r2}?\\d+:\\d+(?:~(?:\\d+:)?\\d+)?(?:；|，|。)?)`;
    // console.log(partA);
    // new RegExp(partA); // test
    const partB = `(?:參?(?:${r2})\\d+)`; // 參?(?:撒下|詩)\d+
    // console.log(partB);
    // new RegExp(partB); // test
    const r3 = `(?:${partA}|${partB})+`;
    // console.log(r3);

    AddReferenceCnv.reg1 = new RegExp(r3, 'g');

    // /(詩|撒下|太|約|路)?(\d+:\d+(?:-(?:\d+:)?\d+)?)|(詩|撒下|太|約|路)\d+/g);
    const r4 = `${r1}`;
    const partA2 = `(${r4})?(\\d+:\\d+(?:-(?:\\d+:)?\\d+)?)`;
    const partB2 = `(?:${r4})\\d+`;
    AddReferenceCnv.reg2 = new RegExp(`${partA2}|${partB2}`, 'g');





    //
    return;
    // （太28:1~8；路24:1~10；約20:1~10）
    // （撒下22:1~51）
    // （「靈」或譯：「榮耀」或「肝」；與30:12，57:8，108:1同）
    // （詩53）
    // （太26:6~13；約12:1~8。參路7:36~50）

    // 發展過程
    // tslint:disable-next-line: no-unused-expression
    /(?:(?:太|路|約)\d+:\d+~\d+；?)+/g; // 從 （太28:1~8；路24:1~10；約20:1~10）
    // tslint:disable-next-line: no-unused-expression
    /(?:(?:太|路|約|撒下)\d+:\d+~\d+；?)+/g; // 從 （撒下22:1~51）
    // tslint:disable-next-line: no-unused-expression
    /(?:(?:太|路|約|撒下)?\d+:\d+(?:~\d+)?(?:；|，)?)+/g; // 從 （30:12，57:8，108:1）

    // 下步驟最要注意的是，不是把 詩?\d+, 這樣像純數字, 也會被包進來,
    // 承上, 因此, 若只有章, 就要用「詩50」
    // tslint:disable-next-line: no-unused-expression
    /(?:(?:(?:太|路|約|撒下)?\d+:\d+(?:~\d+)?(?:；|，)?)|詩\d+)+/g; // 從 （詩53）

    // tslint:disable-next-line: no-unused-expression
    /(?:(?:參?(?:太|路|約|撒下)?\d+:\d+(?:~\d+)?(?:；|，|。)?)|參?(?:詩)\d+)+/g; // 從 （詩53）
    // 從 （太26:6~13；約12:1~8。參路7:36~50）

  }
}

