import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import * as LQ from 'linq';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DSearchData } from '../rwd-frameset/search-result-dialog/search-result-dialog.component';
import { ajax } from 'rxjs/ajax';
import { FhlUrl } from '../fhl-api/FhlUrl';
import { map } from 'rxjs/operators';
import { DAbvResult } from '../fhl-api/ApiAbv';
@Component({
  selector: 'app-version-selector',
  templateUrl: './version-selector.component.html',
  styleUrls: ['./version-selector.component.css']
})
export class VersionSelectorComponent implements OnInit {
  versions: DVersion[];
  versionCurrentNa: string[] = [];

  constructor(private changeDetector: ChangeDetectorRef,
    private dialogRef: MatDialogRef<VersionSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public dataByParent: { isSnOnly?: 0 | 1, isLimitOne?: 0 | 1; versions?: string[] }) { }
  ngOnInit() {
    verQ().then(re => {
      const rr1 = this.dataByParent.isSnOnly === 1 ?
        re.record.filter(a1 => a1.strong === 1) : re.record;
      const rr2 = rr1.map(aa1 => ({ na: aa1.book, naChinese: aa1.cname }));
      this.versions = rr2;
      this.versionCurrentNa = [...this.dataByParent.versions];
    });

    async function verQ() {
      const r1 = await ajax({ url: `${new FhlUrl().getJsonUrl()}uiabv.php` })
        .pipe(map(a1 => a1.response as DAbvResult)).toPromise();
      return r1;
      // return r1.record.map(a1 => ({ nameShow: a1.cname, name: a1.book }));
    }
  }
  /** 單選的時候, 直接關閉, 並回傳結果 ['unv'] */
  onClick(it: DVersion) {
    if (this.dataByParent.isLimitOne === 1) {
      this.dialogRef.close([it.na]);
    } else {
      if (this.versionCurrentNa.includes(it.na)) {
        const r1 = LQ.from(this.versionCurrentNa).indexOf(a1 => a1 === it.na);
        this.versionCurrentNa.splice(r1, 1);
        this.changeDetector.markForCheck();
      } else {
        this.versionCurrentNa.push(it.na);
        this.changeDetector.markForCheck();
      }
    }
  }
  isSelected(it: DVersion) {
    return this.versionCurrentNa.includes(it.na);
  }
  /** 繪圖。多選的時候，才要繪目前選取的，單選，就點一下就結束。 */
  isRenderSelections() {
    return this.dataByParent.isLimitOne !== 1;
  }
  getSelected() {
    const r1 = LQ.from(this.versions);
    return LQ.from(this.versionCurrentNa).select(a1 => r1.firstOrDefault(aa1 => aa1.na === a1)).toArray();
  }
  getDialogResults() {
    if (this.versionCurrentNa.length === 0) {
      return [];
    } else {
      if (this.dataByParent.isLimitOne === 1) {
        return [this.versionCurrentNa[0]];
      } else {
        return this.versionCurrentNa;
      }
    }
  }
}
interface DVersion { na: string; naChinese: string; }

export class DialogVersionSelectorOpenor {
  constructor(private dialog: MatDialog) { }
  /**
   * @param {({ isLimitOne?: 0 | 1; versions?: string[] })} arg 只允許一個，就加1。versions是 unv 等字串
   */
  showDialog(arg: { isSnOnly?: 0 | 1; isLimitOne?: 0 | 1; versions?: string[] }): MatDialogRef<VersionSelectorComponent, any> {
    const data = { isSnOnly: arg.isSnOnly, isLimitOne: arg.isLimitOne, versions: arg.versions };
    const dialogRef = this.dialog.open(VersionSelectorComponent, {
      data
    });
    return dialogRef;
  }
}
