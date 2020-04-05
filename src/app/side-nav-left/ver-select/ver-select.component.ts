import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-ver-select',
  templateUrl: './ver-select.component.html',
  styleUrls: ['./ver-select.component.css']
})
export class VerSelectComponent implements OnInit {
  private versionQ: IVersionsQuery;
  @ViewChildren('verC', { read: false }) vers: QueryList<any>;
  verClass = [
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
  ];
  constructor() { }

  ngOnInit() {
    if (this.versionQ !== undefined) {
      this.verClass = this.versionQ.queryBibleVersion();
    }
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
  queryBibleVersion();
}
