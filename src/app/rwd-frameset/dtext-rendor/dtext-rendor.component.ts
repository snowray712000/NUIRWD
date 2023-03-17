import { IsColorKeyword } from '../settings/IsColorKeyword';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DText } from "src/app/bible-text-convertor/DText";
import Enumerable from 'linq';
import { IsSnManager } from '../settings/IsSnManager';
import { SnActiveEvent } from "../settings/SnActiveEvent";
import { lastValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogFootComponent } from '../dialog-foot/dialog-foot.component';
import { ApiRt } from 'src/app/fhl-api/ApiRt';
import { DialogSearchResultOpenor } from '../search-result-dialog/DialogSearchResultOpenor';
@Component({
    selector: 'app-dtext-rendor',
    templateUrl: './dtext-rendor.component.html',
    styleUrls: ['./dtext-rendor.component.css']
})
export class DTextRendorComponent implements OnInit, OnChanges {
    @Input() data: DText;
    /** 原文彙編用。不論設定值開或關，當是原文彙編時，一定要開著。 */
    @Input() isShowOrig?: 0 | 1;
    @Output() clickRef: EventEmitter<DText> = new EventEmitter();
    @Output() clickOrig: EventEmitter<DText> = new EventEmitter();
    idxPass: number[];
    constructor(public dialog: MatDialog, public detector: ChangeDetectorRef) {
        const that = this;

        SnActiveEvent.s.changed$.subscribe(a1 => {
            let data = that.data
            if (undefined != data.sn) {
                if (data.tp == a1.tp && data.sn == a1.sn) {
                    data.isSnActived = 1
                } else {
                    data.isSnActived = 0
                }
            }
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
    }
    ngOnInit() {
    }
    onClickReference(a1: DText) {
        this.clickRef.emit(a1);
    }
    onClickOrig(a1: DText) {
        this.clickOrig.emit(a1);
        SnActiveEvent.s.updateValueAndTriggerEvent(a1); // 平板沒有 mouse move, 所以還是加這一個
    }
    onMouseEnterSn(en, a1: DText) {
        SnActiveEvent.s.updateValueAndTriggerEvent(a1);
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
            const r1 = lastValueFrom(getFromApi()).then(arg1 => {
                if (arg1.status === 'success') {
                    a1.foot.text = arg1.record[0].text;
                    console.log(a1);
                    pthis.dialog.open(DialogFootComponent, { data: a1 });
                }
            });
        } else {
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
