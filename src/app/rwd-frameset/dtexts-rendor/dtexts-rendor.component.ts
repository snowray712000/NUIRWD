import { IsColorKeyword } from '../settings/IsColorKeyword';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DText } from 'src/app/bible-text-convertor/AddBase';
import Enumerable from 'linq';
import { getIdxPass } from './getIdxPass';
import { isArrayEqual } from 'src/app/tools/arrayEqual';
import { IsSnManager } from '../settings/IsSnManager';
import { SnActiveEvent } from "../settings/SnActiveEvent";
import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { FhlUrl } from 'src/app/fhl-api/FhlUrl';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogFootComponent } from '../dialog-foot/dialog-foot.component';
import { ApiRt } from 'src/app/fhl-api/ApiRt';
@Component({
  selector: 'app-dtexts-rendor',
  templateUrl: './dtexts-rendor.component.html',
  styleUrls: ['./dtexts-rendor.component.css']
})
export class DTextsRendorComponent implements OnInit, OnChanges {
  @Input() datas: DText[] = [];
  @Input() indexs: number[] = undefined;
  /** 原文彙編用。不論設定值開或關，當是原文彙編時，一定要開著。 */
  @Input() isShowOrig?: 0 | 1;
  @Output() clickRef: EventEmitter<string> = new EventEmitter();
  @Output() clickOrig: EventEmitter<string> = new EventEmitter();
  idxPass: number[];
  constructor(public dialog: MatDialog, public detector: ChangeDetectorRef) {
    const pthis = this;
    SnActiveEvent.s.changed$.subscribe(a1 => {
      if (pthis.datas !== undefined) {
        const r1 = Enumerable.from(pthis.datas).where(a1 => a1.sn !== undefined);
        const r2 = g(a1);
        r1.forEach(a2 => a2.isSnActived = (r2 === g(a2) ? 1 : 0));
        pthis.detector.markForCheck();
      }
      function g(a1) { return a1 === undefined ? '' : a1.tp + a1.sn; }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (isCommentUseDtextRendor()) {
      this.init();
    }

    return;
    function isCommentUseDtextRendor() {
      // 如果是注釋, 表單載入就會跑第1次, 切換的時候, 不像 dialog 是重 new 一個, 所以它仍然是 data 改變, 但不是 isFirst.
      // tslint:disable-next-line: max-line-length
      return changes['datas'] !== undefined && changes['indexs'] === undefined && changes['isEnableColorKeyword'] === undefined && false === isArrayEqual(changes['datas'].previousValue, changes['datas'].currentValue);
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
      return Enumerable.range(0, datas.length).toArray();
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
  onClickOrig(a1: DText) {
    this.clickOrig.emit(a1.w);
    SnActiveEvent.s.updateValueAndTriggerEvent(a1); // 平板沒有 mouse move, 所以還是加這一個
  }
  onMouseEnterSn(en, a1: DText) {
    SnActiveEvent.s.updateValueAndTriggerEvent(a1);
  }
  /** tp, 0 OrderStart 1 ListStart */
  getIndexsForChildOrderCore(it1: DText, i1: number, tp: 0 | 1) {
    // 目前是 i1, 是 [2], 應該要得到 [3] 因為 isOrderEnd 在[4]
    // 若, isOrderEnd 在[5], 應該要得到 [3,4]
    let cntStart = 0;

    // 從[2], 在 End在[4]例子, idxEnd會是 1
    // 從[2], 在 End在[5]例子, idxEnd會是 2
    const idxEnd = Enumerable.from(this.datas).skip(i1 + 1).indexOf(a1 => {
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

    const re = Enumerable.range(i1 + 1, idxEnd).toArray();
    return re;
  }
  getIndexsForChildOrder(it1: DText, i1: number) {
    return this.getIndexsForChildOrderCore(it1, i1, 0);
  }
  getIndexsForChildList(it1: DText, i1: number) {
    return this.getIndexsForChildOrderCore(it1, i1, 1);
  }
  isPass(i1: number) {
    if (Enumerable.from(this.indexs).contains(i1)) {
      if (Enumerable.from(this.idxPass).contains(i1)) {
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
    // aa1.key !== undefined ? 1 : 0,
    aa1.foot !== undefined ? 1 : 0,
    ];
    return Enumerable.from(r).all(a1 => a1 !== 1);
  }
  onClickFoot(a1: DText) {
    const pthis = this;
    if (a1.foot.text === undefined) {
      const r1 = getFromApi().toPromise().then(arg1 => {
        if (arg1.status === 'success') {
          a1.foot.text = arg1.record[0].text;
          console.log(a1);

          pthis.dialog.open(DialogFootComponent, { data: a1 });
        }
      });
    } else {
      console.log(a1);
      pthis.dialog.open(DialogFootComponent, { data: a1 });
    }
    return;

    interface DRtResult { record: { id: number, text: string }[], status?: 'success' };
    function getFromApi(): Observable<DRtResult> {
      return new ApiRt().queryQpAsync(a1.foot)
    }
  }
  getKeywordClass(a1: DText) {
    const re: string[] = [];
    if (a1.isParenthesesFW === 1) re.push('isParenthesesFW');
    if (a1.isParenthesesFW2 === 1) re.push('isParenthesesFW2');
    if (a1.isParenthesesHW === 1) re.push('isParenthesesHW');
    if (a1.isTitle1 === 1) re.push('isTitle1');
    if (a1.isBold === 1) re.push('isBold');
    if (a1.isName === 1) re.push('isName');

    if (IsColorKeyword.s.getFromLocalStorage()) {
      if (a1.keyIdx0based !== undefined) {
        re.push('keyword');
        const k = a1.keyIdx0based % 7; // style 顏色目前只有 0-6
        re.push('key' + k);
      }
    }
    return re.join(' ');
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
    const re: string[] = [];
    re.push('orig');
    if (IsColorKeyword.s.getFromLocalStorage() && it1.keyIdx0based !== undefined) {
      re.push('keyword');
      const k = it1.keyIdx0based % 7; // style 顏色目前只有 0-6
      re.push('key' + k);
    }

    if (it1.isSnActived === 1) {
      re.push('isSnActived');
    }
    return re.join(' ');
  }
  getIsShowOrig() {
    // 當 原文彙編時，一定要顯示 ，
    if (this.isShowOrig === undefined) return IsSnManager.s.getFromLocalStorage();
    return this.isShowOrig === 1;
  }
}
