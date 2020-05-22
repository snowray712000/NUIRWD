import { Component, OnInit } from '@angular/core';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiQsb, QsbArgs, OneQsbRecord } from 'src/app/fhl-api/ApiQsb';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookNameToId } from 'src/app/const/book-name/book-name-to-id';
import { TextWithSnConvertor } from 'src/app/side-nav-right/cbol-parsing/TextWithSnConvertor';
import { DAddress } from 'src/app/bible-address/DAddress';
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { BookChapDistinctTool } from './BookChapDistinctTool';
import { ApiSobj, DApiSobOneRecord } from 'src/app/fhl-api/ApiSobj';
import { distinct_linq } from 'src/app/linq-like/distinct';
import { firstOrDefault } from 'src/app/linq-like/FirstOrDefault';
import { SplitStringByRegex, SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';


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
    const re1 = new BookChapDistinctTool(verseRange);
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
class BibleTextOneVersionQuery {
  async mainAsync(verses: VerseRange, ver?: string) {
    if (ver === undefined) {
      ver = 'unv';
    }
    const re1 = await this.getTextFromApi(verses, ver);
    console.log(re1);

    const re2 = re1.record.map(a1 => this.findSn(a1));
    console.log(re2);

    const re3 = await this.getPhotoMapFromApi(verses);
    // console.log(re3);

    const map1 = new Map<number, DApiSobOneRecord>();
    for (const it1 of re3) {
      for (const it2 of it1.record) {
        const id = parseInt(it2.id, 10);
        if (map1.has(id) === false) {
          map1.set(id, it2);
        }
      }
    }
    // console.log(map1);

    let naAll: string[] = [];
    let regAll: RegExp;
    const map2 = new Map<RegExp, number>();
    for (const ky of map1.keys()) {
      const it1 = map1.get(ky);
      const na: string[] = [];
      na.push(it1.cname);
      na.push(it1.c1name);
      na.push(it1.c2name);
      na.push(it1.mname);
      na.push(it1.ename);
      const na2 = distinct_linq(na).filter(a1 => a1 !== undefined && a1.length !== 0).sort(a1 => -a1.length);
      // console.log(na2);
      na2.forEach(a1 => naAll.push(a1));

      if (na2.length > 0) {
        const naOr = na2.join('|');
        // /(?:Green|希利尼|希臘)/ig
        const regStr = `${naOr}`;
        const reg = new RegExp(regStr, 'ig');
        map2.set(reg, ky);
      }
    }
    console.log(map2);
    naAll = distinct_linq(naAll).filter(a1 => a1 !== undefined && a1.length !== 0).sort(a1 => -a1.length);
    if (naAll.length > 0) {
      // console.log(naAll);
      regAll = new RegExp(`(?:${naAll.join('|')})`, 'ig');
      console.log(regAll);
    }

    const re4EachLine = [];
    const keys2 = Array.from(map2.keys());
    for (const it of re2) {
      const reThisLine = [];
      for (const it2 of it.children) {
        if (it2.sn !== undefined) {
          reThisLine.push(it2);
          continue;
        }
        const r1 = regAll.exec(it2.w);
        if (r1 == null) {
          reThisLine.push(it2);
          continue;
        }

        const r2 = firstOrDefault(keys2, a1 => a1.exec(it2.w) !== null);
        r2.lastIndex = -1; // 要設定回-1, 因為是 global, 不然下次找到同個,就會找不到了
        const r4 = new SplitStringByRegexVer2().main(it2.w, r2);
        const idObj = map2.get(r2);
        const obj = map1.get(idObj);
        for (const it3 of r4) {
          if (it3.exec === undefined) {
            reThisLine.push(it3);
            continue;
          }

          const isSite = obj.is_site === '1';
          const isPhoto = true;
          if (isSite && isPhoto) {
            reThisLine.push({ w: it3.w, sobj: obj, isMap: true });
            reThisLine.push({ w: '', sobj: obj, isPhoto: true });
          } else if (isSite) {
            reThisLine.push({ w: it3.w, sobj: obj, isMap: true });
          } else if (isPhoto) {
            // reThisLine.push({ w: it3.w });
            reThisLine.push({ w: it3.w, sobj: obj, isPhoto: true });
          } else {
            reThisLine.push({ w: it3.w });
          }
        }
      }
      re4EachLine.push({
        address: it.address,
        children: reThisLine
      });
    }
    console.log(re4EachLine);

    return re4EachLine;
  }

  private async getPhotoMapFromApi(verses: VerseRange) {
    const r1 = new BookChapDistinctTool(verses);
    const r2 = r1.addressesOfBookChap.map(a1 => {
      a1.verse = -1;
      return new ApiSobj().querySobjAsync({ address: a1 }).toPromise();
    });
    const re3 = await Promise.all(r2);
    return re3;
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

  private async getTextFromApi(verses: VerseRange, ver: string) {
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
