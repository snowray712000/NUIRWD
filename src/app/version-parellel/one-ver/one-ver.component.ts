import { Component, OnInit } from '@angular/core';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { ReferenceAndOrigFinderUsingAtCommentTool } from 'src/app/side-nav-right/comment-tool/com-text/ReferenceAndOrigFinderUsingAtCommentTool';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
import { TextWithSnConvertor } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { DAddress } from 'src/app/bible-address/DAddress';
import { groupBy } from 'rxjs/operators';
import { of } from 'rxjs';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';

@Component({
  selector: 'app-one-ver',
  templateUrl: './one-ver.component.html',
  styleUrls: ['./one-ver.component.css']
})
export class OneVerComponent implements OnInit {
  ver: string = 'unv';
  data;
  /** 0 只 show 節, 1 show 章節, 2 show 書章節, -1 不 show */
  flagShowAddress = 0;
  constructor(private route: ActivatedRoute, private router: Router) {
    const routeFrame = new RouteStartedWhenFrame(this.route, this.router);

    routeFrame.routeTools.verseRange$.subscribe(async verseRange => {
      this.flagShowAddress = this.determineFlagShowAddress(verseRange);

      this.data = await new BibleTextOneVersionQuery().mainAsync(verseRange, this.ver);

    });
  }

  getAddressShow(address: DAddress) {
    const flag = this.flagShowAddress;
    if (flag === 0) {
      return `${address.verse}`;
    } else if (flag === 1) {
      return `${address.chap}:${address.verse}`;
    } else if (flag === 2) {
      const na = BibleBookNames.getBookName(address.book, BookNameLang.太);
      return `${na}${address.chap}:${address.verse}`;
    }
    return '';
  }
  private determineFlagShowAddress(verseRange: VerseRange) {
    const re1 = new FlagAddressShow(verseRange);
    let flag = -1;
    if (re1.cntBook > 1) {
      flag = 2;
    } else if (re1.cntChap > 1) {
      flag = 1;
    } else {
      flag = 0;
    }
    return flag;
  }

  ngOnInit() {
  }

}
/** 決定經文有必要顯示多少,應該會沒用,因為使用者可能想copy書卷名稱 */
export class FlagAddressShow {
  cntBook: number;
  cntChap: number;
  constructor(verses: VerseRange) {
    let cntBook = 0;
    let cntChap = 0;
    let add: DAddress;
    for (const it of verses.verses) {
      if (add === undefined) {
        cntBook++;
        cntChap++;
        add = { book: it.book, chap: it.chap, verse: it.sec };
        continue;
      }
      if (it.book !== add.book) {
        cntBook++;
        add = { book: it.book, chap: it.chap, verse: it.sec };
      } else if (it.chap !== add.chap) {
        cntChap++;
        add = { book: it.book, chap: it.chap, verse: it.sec };
      }
    }
    this.cntBook = cntBook;
    this.cntChap = cntChap;
  }
}
class BibleTextOneVersionQuery {
  async mainAsync(verses: VerseRange, ver?: string) {
    if (ver === undefined) {
      ver = 'unv';
    }
    const re1 = await this.getFromApi(verses, ver);
    console.log(re1);

    const re2 = re1.record.map(a1 => this.findSn(a1));
    console.log(re2);

    return re2;
  }

  private findSn(a1: OneQsbRecord) {
    const book = new BookNameToId().cvtName2Id(a1.engs);
    const address = { book, chap: a1.chap, verse: a1.sec };
    const r1 = new TextWithSnConvertor().processTextWithSn(a1.bible_text);

    return {
      address,
      children: r1,
    };
  }

  private async getFromApi(verses: VerseRange, ver: string) {
    const qstr = verses.toStringChineseShort();
    const arg: QsbArgs = {
      qstr,
      bibleVersion: ver,
      isExistStrong: true,
      isSimpleChinese: false,
    };
    const re1 = await new ApiQsb().queryQsbAsync(arg).toPromise();
    return re1;
  }
}
