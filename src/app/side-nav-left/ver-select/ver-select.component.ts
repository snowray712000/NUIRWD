import { Component, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { BibleVersionQueryService } from '../../fhl-api/bible-version-query.service';
import { of, Observable, interval as rxjsInterval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, map, catchError, shareReplay } from 'rxjs/operators';
import { IBibleVersionQueryService } from 'src/app/fhl-api/IBibleVersionQueryService';
import { DateAdapter } from '@angular/material/core';
import { IConvertBibleVersionId2Eng, IConvertBibleVersionEng2Id } from '../../fhl-api/i-convert-bible-version';
import { ConvertBibleVersionTool } from '../../fhl-api/convert-bible-version';

// IConvertBibleVersionEng2Id 會用到, (通用的) - checkbox 轉回 id 時會用
function testData() {
  return of([
    {
      na: '中文',
      vers: [
        { na: '和合本', eng: 'unv' },
        { na: '新譯本', eng: 'cnv' }
      ],
    },
    {
      na: '英文',
      vers: [
        { na: '和合本1', eng: 'unv1' },
        { na: '新譯本1', eng: 'cnv1' }
      ],
    },
  ]);
}

@Component({
  selector: 'app-ver-select',
  templateUrl: './ver-select.component.html',
  styleUrls: ['./ver-select.component.css']
})
export class VerSelectComponent implements OnInit {
  private versionQ: IVersionsQuery;
  private eng2id: IConvertBibleVersionEng2Id;
  @ViewChildren('verC', { read: false }) vers: QueryList<any>;
  /** emit([0,2,3]) bible version ids */
  @Output() notify = new EventEmitter<Array<number>>();
  verClass = testData();
  constructor() {
    this.versionQ = new VersionsQuery(undefined);
    const cvtVer = new ConvertBibleVersionTool();
    this.eng2id = cvtVer;
  }

  ngOnInit() {
    if (this.versionQ !== undefined) {
      this.verClass = this.versionQ.queryBibleVersionAsync();
    }
  }
  /** 在 html 中, checkbox select changed 時會自動觸發這個 */
  private onSelectChanged() {
    const vers = this.getVersionsFromVerCControls();
    const pthis = this;
    this.cvtEngVers2IdVers(vers).then(a1 => {
      pthis.notify.emit(a1);
    });
  }
  private async cvtEngVers2IdVers(engs) {
    const re = [];
    for (const it of engs) {
      const r1 = await this.eng2id.convertEng2IdAsync(it);
      if (r1 !== undefined) {
        re.push(r1);
      }
    }
    return re;
  }

  private getVersionsFromVerCControls(): Array<string> {
    const vers = [];
    this.vers.forEach(a1 => {
      a1.selectedOptions.selected.forEach(a2 => {
        vers.push(a2.value);
      });
    });
    return vers;
  }
  /** 供 html 中按下全選,全不選 時用
   *  用程式全選/全不選,不會主動觸發 onSelectChange
   *  這個函式會呼叫 onSelectChange
   */
  private onClickButton(set1or0: number, idxOpt: number) {
    // 其實 ver 是 MatSelectionList class , 但設定的話 _element 會被 compiler 會 private 的
    this.vers.forEach(a1 => {
      if (a1._element.nativeElement.id === 'opt' + idxOpt) {
        if (set1or0 === 1) {
          a1.selectAll();
          this.onSelectChanged();
        } else {
          a1.deselectAll();
          this.onSelectChanged();
        }
      }
    });
  }
}

interface IVersionsQuery {
  queryBibleVersionAsync();
}

class VersionsQuery implements IVersionsQuery {
  private static subClass = [
    { na: '中文', engs: 'unv,ncv,tcv95,recover,lcc,wlunv,ddv,csb,cnet,cccbst,nt1864,mor1823' },
    { na: '原文', engs: 'cbol,bhs,fhlwh,lxx' },
    { na: '英文', engs: 'kjv,bbe,web,asv,darby,erv,esv' },
    { na: '民族方言', engs: 'apskcl,tte,apskhl,bklcl,bklhl,prebklcl,prebklhl,thv2e,hakka,sgebklcl,sgebklhl,rukai,tsou,ams,ttnt94' },
    { na: '尚未分類', engs: '' }
  ];
  private bibleQ: IBibleVersionQueryService;
  constructor(bibleQ: IBibleVersionQueryService) {
    this.bibleQ = bibleQ;
    if (this.bibleQ === undefined) {
      this.bibleQ = new BibleVersionQueryService();
    }


  }
  queryBibleVersionAsync() {
    return this.bibleQ.queryBibleVersionsAsync().pipe(
      // tap(a1 => console.log(a1),
      map(a1 => {
        const r1 = {};
        VersionsQuery.subClass.forEach(a2 => r1[a2.na] = []);
        // console.log(r1);

        const r2 = {};
        VersionsQuery.subClass.forEach(a2 => r2[a2.na] = new RegExp(this.gRegexString(a2.engs)));
        // console.log(r2);

        a1.forEach(a2 => {
          let isFinded = false;
          for (const key in r2) {
            if (r2.hasOwnProperty(key)) {
              const reg = r2[key];
              if (a2.na.match(reg)) {
                // console.log(a2);
                r1[key].push({ na: a2.naChinese, eng: a2.na });
                isFinded = true;
                break;
              }
            }
          }
          if (isFinded === false) {
            // tslint:disable-next-line: no-string-literal
            r1['尚未分類'].push({ na: a2.naChinese, eng: a2.na });
          }
        });
        // console.log(r1);

        const re = [];
        for (const key in r1) {
          if (r1.hasOwnProperty(key)) {
            const element = r1[key];
            re.push({ na: key, vers: element });
          }
        }
        // console.log(re);

        return re;
      }),
    );
  }
  /** cbol,bhs,fhlwh,lxx */
  private gRegexString(engs: string) {
    return '^(' + engs.split(',').join(')|(') + ')$';
  }
}
