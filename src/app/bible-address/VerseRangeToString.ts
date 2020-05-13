import { getVerseCount } from 'src/app/const/count-of-verse';
import { VerseAddress } from 'src/app/bible-address/VerseAddress';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { getChapCount } from 'src/app/const/count-of-chap';
export class VerseRangeToString {
  main(verses: VerseAddress[], lang: BookNameLang = BookNameLang.太) {
    const re = this.splitBookId(verses);
    const re2 = re.map(a1 => this.splitContinueVerse(a1));
    const re3 = re2.map(a1 => this.splitTheSameChap(a1));
    const re4 = re3.map(a1 => this.getDescriptionEachBook(a1, lang)).join(';');
    return re4;
  }
  private getDescriptionEachBook(arg: VerseAddress[][][], lang: BookNameLang) {
    const id = arg[0][0][0].book;
    const na = BibleBookNames.getBookName(id, lang);
    const des = arg.map(a1 => {
      // a1 可能是 1:23,25-27,30,32-42 (a1.length===4)
      // a1 可能是 1:23-25 (a1.length===1) (a1[0].length>1 && a1[0].first().chap == a1[0].last().chap)
      // a1 可能是 1:23-2:2 (a1.length===1) (a1[0].length>1 && a1[0].first().chap != a1[0].last().chap)
      // a1 可能是 1:23 (a1.length===1) (a1[0].length==1)
      // 第2種情況，可能縮成整章可能...約二 case
      if (a1.length > 1) {
        // a1: [[23],[25,26,27],[30],[32,33...41,42]]
        const chap = a1[0][0].chap;
        const r2 = a1.map(a2 => {
          const vr1 = a2[0];
          if (a2.length === 1) {
            return `${vr1.sec}`;
          } else {
            const vr2 = a2[a2.length - 1];
            return `${vr1.sec}-${vr2.sec}`;
          }
        }).join(',');
        return `${chap}:${r2}`; // case 1
      } else {
        const a2 = a1[0];
        const vr1 = a2[0];
        const chap = vr1.chap;
        if (a2.length > 1) {
          const vr2 = a2[a2.length - 1];
          if (vr1.chap !== vr2.chap) {
            return `${chap}:${vr1.sec}-${vr2.chap}:${vr2.sec}`; // case 3
          } else {
            if (vr1.sec === 1 && vr2.sec === getVerseCount(id, chap)) {
              if (getChapCount(id) === 1) {
                return ''; // 此書若只有一章, 連1都不用
              }
              return `${chap}`; // case 2 special, 約二整章
            }
            return `${chap}:${vr1.sec}-${vr2.sec}`; // case 2
          }
        } else {
          return `${chap}:${vr1.sec}`; // case 4
        }
      }
    }).join(';');
    const re4 = na + des;
    return re4;
  }

  private splitTheSameChap(vrsOneBook: VerseAddress[][]): VerseAddress[][][] {
    const re3 = [];
    let sameChap = [];
    let chap = -1;
    const fnPushSameChapToResult = () => {
      if (sameChap.length > 0) {
        re3.push(sameChap);
      }
      sameChap = [];
    };
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < vrsOneBook.length; i++) {
      const vrsOneContinue = vrsOneBook[i];
      const vr1 = vrsOneContinue[0];
      if (vrsOneContinue.length > 1) { // 有連續的
        const vr2 = vrsOneContinue[vrsOneContinue.length - 1];
        if (vr1.chap !== vr2.chap) {
          // 是 2:3-3:1 不是 2:3-5 這種
          fnPushSameChapToResult();
          sameChap.push(vrsOneContinue);
          fnPushSameChapToResult();
          // 下一個不論是什麼, 都重新開始累計
          chap = -1;
        } else {
          // 是 2:3-5 這種, 不是 2:3-3:1 這種
          if (chap === vr1.chap) {
            sameChap.push(vrsOneContinue);
          } else {
            fnPushSameChapToResult();
            // 下一個
            sameChap.push(vrsOneContinue);
            chap = vr1.chap;
          }
        }
      } else {
        if (vrsOneContinue[0].chap !== chap) {
          fnPushSameChapToResult();
          // 下一個
          sameChap.push(vrsOneContinue);
          chap = vr1.chap;
        } else {
          sameChap.push(vrsOneContinue);
        }
      }
    }
    if (sameChap.length > 0) {
      re3.push(sameChap);
    }
    return re3;
  }
  private splitContinueVerse(vrsOneBook: VerseAddress[]): VerseAddress[][] {
    const re2 = [];
    let re1 = [];
    for (let i = 0; i < vrsOneBook.length; i++) {
      if (i !== 0 && this.isContinueVerse(vrsOneBook[i - 1], vrsOneBook[i])) {
        re1.push(vrsOneBook[i]);
      } else {
        if (re1.length !== 0) {
          re2.push(re1);
        }
        re1 = [];
        re1.push(vrsOneBook[i]);
      }
    }
    if (re1.length !== 0) {
      re2.push(re1);
    }
    return re2;
  }
  private isContinueVerse(vr1: VerseAddress, vr2: VerseAddress) {
    if (vr1.chap === vr2.chap) {
      if (vr1.sec + 1 === vr2.sec) {
        return true;
      } else {
        return false;
      }
    } else {
      if (vr1.chap + 1 === vr2.chap && vr2.sec === 1) {
        if (getVerseCount(vr1.book, vr1.chap) === vr1.sec) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  private splitBookId(verses: VerseAddress[]): VerseAddress[][] {
    const re: VerseAddress[][] = [];
    let id: number;
    let r1: VerseAddress[];
    for (const it1 of verses) {
      if (id === it1.book) {
        r1.push(it1);
      } else {
        if (r1 !== undefined && r1.length !== 0) {
          re.push(r1);
        }
        r1 = [];
        id = it1.book;
        r1.push(it1);
      }
    }
    if (r1.length !== 0) {
      re.push(r1);
    }
    return re;
  }
}
