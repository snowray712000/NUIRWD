import { SearchSetting } from './../search-result-dialog/SearchSetting';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DText } from 'src/app/bible-text-convertor/AddBase';
import * as LQ from 'linq';
import { getIdxPass } from './getIdxPass';
import { addListStartAndEnd } from './addListStartAndEnd';
import { EventManager } from '@angular/platform-browser';
import { isArrayEqual } from 'src/app/tools/arrayEqual';
import { IsSnManager } from '../settings/IsSnManager';
@Component({
  selector: 'app-dtexts-rendor',
  templateUrl: './dtexts-rendor.component.html',
  styleUrls: ['./dtexts-rendor.component.css']
})
export class DTextsRendorComponent implements OnInit, OnChanges {
  @Input() datas: DText[] = [];
  @Input() indexs: number[] = undefined;
  @Output() clickRef: EventEmitter<string> = new EventEmitter();
  @Output() clickOrig: EventEmitter<string> = new EventEmitter();
  idxPass: number[];
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (isCommentUseDtextRendor()) {
      this.init();
    }

    return;
    function isCommentUseDtextRendor() {
      // 如果是注釋, 表單載入就會跑第1次, 切換的時候, 不像 dialog 是重 new 一個, 所以它仍然是 data 改變, 但不是 isFirst.
      // tslint:disable-next-line: max-line-length
      return changes.datas !== undefined && changes.indexs === undefined && changes.isEnableColorKeyword === undefined && false === isArrayEqual(changes.datas.previousValue, changes.datas.currentValue);
    }
  }
  init() {
    if (this.indexs === undefined) {
      //   // 只有第1層, indexs 是用 datas 傳進來的, 其它 recursive 是算出來的 getIndexsForChildList()
      this.indexs = gAllIndexs(this.datas);
    }
    this.idxPass = this.idxPass = getIdxPass(this.datas, this.indexs);
    return;
    function gAllIndexs(datas: DText[]) {
      return LQ.range(0, datas.length).toArray();
    }
  }

  ngOnInit() {
    // 如果是注釋, OnInit時候, datas 會是 undefined, (所以它從 onChange 初始化 indexs)
    // 如果是 dialog, 就會從這邊初始化
    if (this.datas === undefined) {
      return;
    }

    this.init();
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
    const r = [aa1.isBr, aa1.isHr, aa1.isListStart, aa1.isListEnd, aa1.isOrderStart, aa1.isOrderEnd, aa1.isRef,
    aa1.sn !== undefined ? 1 : 0,
    aa1.key !== undefined ? 1 : 0,
    aa1.foot !== undefined ? 1 : 0,
    ];
    return LQ.from(r).all(a1 => a1 !== 1);
  }
  onClickFoot(a1: DText) {
    console.log(a1.foot);
  }
  getKeywordClass(a1: DText) {
    if (new SearchSetting().loadIsEnableColorKeyword() !== 1) {
      return undefined;
    }

    if (a1.keyIdx0based !== undefined) {
      let re = '';
      const k = a1.keyIdx0based % 7; // style 顏色目前只有 0-6
      re += `keyword key${k}`;
      return re;
    }

    return undefined;
  }
  isClassTwcbExp(it1: DText) {
    if (it1.class !== undefined) {
      return /exp/.test(it1.class);
    }
    return false;
  }
  isClassTwcbBibtext(it1: DText) {
    if (it1.class !== undefined) {
      return /bibtext/.test(it1.class);
    }
    return false;
  }
  isClassTwcbIdt(it1: DText) {
    if (it1.class !== undefined) {
      return /idt/.test(it1.class);
    }
    return false;
  }
  /** orig or 'orig keyword key0' */
  getOrigClass(it1: DText) {
    if (it1.sn !== undefined) {
      let re = 'orig';
      if (it1.keyIdx0based !== undefined && isEnable()) {
        const k = it1.keyIdx0based % 7; // style 顏色目前只有 0-6
        re += `keyword key${k}`;
      }
      return re;
      function isEnable() {
        return new SearchSetting().loadIsEnableColorKeyword() === 1;
      }
    }
    return undefined;
  }
  getIsShowOrig() {
    return IsSnManager.s.getFromLocalStorage();
  }
}
