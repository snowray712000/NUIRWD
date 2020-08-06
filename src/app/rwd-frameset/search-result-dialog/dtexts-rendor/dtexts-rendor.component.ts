import { SearchSetting } from './../SearchSetting';
import { log } from 'util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DText } from 'src/app/bible-text-convertor/AddBase';
import * as LQ from 'linq';
import { getIdxPass } from './getIdxPass';
import { addListStartAndEnd } from './addListStartAndEnd';
import { EventManager } from '@angular/platform-browser';
@Component({
  selector: 'app-dtexts-rendor',
  templateUrl: './dtexts-rendor.component.html',
  styleUrls: ['./dtexts-rendor.component.css']
})
export class DTextsRendorComponent implements OnInit {
  @Input() datas: DText[] = [];
  @Input() indexs: number[] = undefined;
  @Input() isEnableColorKeyword: 0 | 1;
  @Output() clickRef: EventEmitter<string> = new EventEmitter();
  @Output() clickOrig: EventEmitter<string> = new EventEmitter();
  idxPass: number[];
  constructor() {
  }

  ngOnInit() {
    if (this.indexs === undefined) {
      // this.datas = gTestData();
      this.indexs = gAllIndexs(this.datas);
    }
    this.idxPass = this.idxPass = getIdxPass(this.datas, this.indexs);
    return;
    function gAllIndexs(datas: DText[]) {
      return LQ.range(0, datas.length).toArray();
    }

  }
  onClickReference(a1: string) {
    this.clickRef.emit(a1);
  }
  onClickOrig(a1: string) {
    this.clickOrig.emit(a1);
  }
  /** tp, 0 OrderStart 1 ListStart */
  getIndexsForChildOrderCore(it1: DText, i1: number, tp: 0 | 1) {
    // 目前是 i1, 是 [2], 應該要得到 [3] 因為 isOrderEnd 在[4]
    // 若, isOrderEnd 在[5], 應該要得到 [3,4]
    let cntStart = 0;

    // 從[2], 在 End在[4]例子, idxEnd會是 1
    // 從[2], 在 End在[5]例子, idxEnd會是 2
    const idxEnd = LQ.from(this.datas).skip(i1 + 1).indexOf(a1 => {
      if (tp === 0) {
        if (a1.isOrderStart === 1) {
          cntStart++;
        } else if (a1.isOrderEnd === 1) {
          cntStart--;
        }
      } else if (tp === 1) {
        if (a1.isListStart === 1) {
          cntStart++;
        } else if (a1.isListEnd === 1) {
          cntStart--;
        }
      }

      return cntStart === -1; // 在沒有累積OrderStart時, 遇到的 OrderEnd
    });

    const re = LQ.range(i1 + 1, idxEnd).toArray();
    return re;
  }
  getIndexsForChildOrder(it1: DText, i1: number) {
    return this.getIndexsForChildOrderCore(it1, i1, 0);
  }
  getIndexsForChildList(it1: DText, i1: number) {
    return this.getIndexsForChildOrderCore(it1, i1, 1);
  }
  isPass(i1: number) {
    if (LQ.from(this.indexs).contains(i1)) {
      if (LQ.from(this.idxPass).contains(i1)) {
        // console.log(i1 + ' pass,在idxPas中');
        return true;
      }
      // console.log(i1 + ' 不pass,不在idxPas中');
      return false;
    } else {
      // console.log(i1 + ' pass,不在允許的index中');
      return true;
    }
  }

  isW(aa1: DText) {
    // tslint:disable-next-line: max-line-length
    const r = [aa1.isBr, aa1.isHr, aa1.isListStart, aa1.isListEnd, aa1.isOrderStart, aa1.isOrderEnd, aa1.isRef, aa1.sn !== undefined ? 1 : 0, aa1.key !== undefined ? 1 : 0];
    return LQ.from(r).all(a1 => a1 !== 1);
  }
  getKeywordClass(a1: DText) {
    if (this.isEnableColorKeyword === 0) {
      if (a1.sn !== undefined) {
        return 'keyword orig';
      } else {
        return 'keyword';
      }
    }
    const idx = a1.keyIdx0based >= 6 ? 6 : a1.keyIdx0based;
    return `keyword key${idx}`;
  }
}
