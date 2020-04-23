import { Component, OnInit } from '@angular/core';
import { ApiQb } from 'src/app/fhl-api/qb';
import { getChapCount } from 'src/app/const/count-of-chap';
import { getVerseCount } from 'src/app/const/count-of-verse';
import { ApiQsb } from 'src/app/fhl-api/qsb';
import { ParsingOneLine } from './ParsingOneLine';

@Component({
  selector: 'app-cbol-parsing',
  templateUrl: './cbol-parsing.component.html',
  styleUrls: ['./cbol-parsing.component.css']
})
export class CbolParsingComponent implements OnInit {
  lines: { words: [{ w: string }], exps: [{ w: string }] }[] = [];
  constructor() {
  }
  ngOnInit() { }
}

class StasticQbGreek {
  async stasticQb() {
    const mapPro = new Map<string, number>();
    const mapWfrom = new Map<string, number>();
    const fnPro = (pro: string) => {
      if (pro == null || pro.length === 0) {
        return;
      }
      if (mapPro.has(pro)) {
        mapPro.set(pro, mapPro.get(pro) + 1);
      } else {
        mapPro.set(pro, 1);
      }
    };
    const fnWform = (wform: string) => {
      if (wform == null || wform.length === 0) {
        return;
      }
      for (const pro of wform.split(' ')) {
        if (mapWfrom.has(pro)) {
          mapWfrom.set(pro, mapWfrom.get(pro) + 1);
        } else {
          mapWfrom.set(pro, 1);
        }
      }
    };
    const bookId = 42;
    const cntChap = getChapCount(bookId);
    for (let chap = 1; chap <= cntChap; chap++) {
      const cntVerse = getVerseCount(bookId, chap);
      for (let verse = 1; verse <= cntVerse; verse++) {
        const re = await this.qbCall(bookId, chap, verse);
        console.log(re);

        for (let i1 = 1; i1 < re.record.length; i1++) {
          const ele = re.record[i1];
          fnPro(ele.pro);
          fnWform(ele.wform);
        }
        console.log('verse ' + verse);
        break;
      }
      console.log('chap ' + chap);
      console.log(mapPro);
      console.log(mapWfrom);
      break;
    }
  }

  async qbCall(bk, ch, vs) {
    return new ApiQb().queryQbAsync(bk, ch, vs).toPromise();
  }
}

