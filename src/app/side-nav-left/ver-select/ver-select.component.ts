import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BibleVersionQueryService } from '../../fhl-api/bible-version-query.service';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { IBibleVersionQueryService } from 'src/app/fhl-api/IBibleVersionQueryService';
@Component({
  selector: 'app-ver-select',
  templateUrl: './ver-select.component.html',
  styleUrls: ['./ver-select.component.css']
})
export class VerSelectComponent implements OnInit {
  private versionQ: IVersionsQuery;
  @ViewChildren('verC', { read: false }) vers: QueryList<any>;
  verClass = of([
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
  constructor() {
    this.versionQ = new VersionsQuery(undefined);
  }

  ngOnInit() {
    if (this.versionQ !== undefined) {
      this.verClass = this.versionQ.queryBibleVersionAsync();
    }

    let aa = new BibleVersionQueryService();
    aa.queryBibleVersionsAsync().toPromise().then(a1 => console.log(a1));
  }
  onSelectChanged() {
    console.log(this.getVersionsFromVerCControls());
  }
  private getVersionsFromVerCControls() {
    const vers = [];
    this.vers.forEach(a1 => {
      a1.selectedOptions.selected.forEach(a2 => {
        vers.push(a2.value);
      });
    });
    return vers;
  }
  onClickButton(set1or0: number, idxOpt: number) {
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
    { na: '原文', engs: 'cbol,bhs,fhlwh,lxx,esv' },
    { na: '英文', engs: 'kjv,bbe,web,asv,darby,erv' },
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
      //tap(a1 => console.log(a1),
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
        console.log(re);

        return re;
      }),
    );
  }
  /** cbol,bhs,fhlwh,lxx */
  private gRegexString(engs: string) {
    return '^(' + engs.split(',').join(')|(') + ')$';
  }
}
